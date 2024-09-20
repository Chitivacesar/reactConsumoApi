import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './apiComponents.css'; // Importa el archivo CSS

const ApiComponent = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingCliente, setEditingCliente] = useState({ _id: null, nombreCompleto: '', documentoCliente: '', celular: '', fechaNacimiento: '' });
    const [newCliente, setNewCliente] = useState({ nombreCompleto: '', documentoCliente: '', celular: '', fechaNacimiento: '' });

    // Fetch initial data
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get('/clientes');
                setClientes(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, []);

    // Add new client
    const handleAdd = async () => {
        if (!newCliente.nombreCompleto || !newCliente.documentoCliente) return;

        try {
            const response = await axios.post('/clientes', newCliente);
            setClientes([...clientes, response.data]);
            setNewCliente({ nombreCompleto: '', documentoCliente: '', celular: '', fechaNacimiento: '' });
        } catch (err) {
            setError(err);
        }
    };

    // Update existing client without refreshing the page
    const handleUpdate = async () => {
        if (!editingCliente._id) return;

        try {
            const response = await axios.put(`/clientes/${editingCliente._id}`, editingCliente);

            // Update the state directly to reflect the change
            setClientes(clientes.map(cliente =>
                cliente._id === editingCliente._id ? response.data : cliente
            ));

            // Clear editing form
            setEditingCliente({ _id: null, nombreCompleto: '', documentoCliente: '', celular: '', fechaNacimiento: '' });
        } catch (err) {
            setError(err);
        }
    };

    // Delete client
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/clientes/${id}`);
            setClientes(clientes.filter(cliente => cliente._id !== id));
        } catch (err) {
            setError(err);
        }
    };

    const handleChange = (e) => {
        setEditingCliente({ ...editingCliente, [e.target.name]: e.target.value });
    };

    const handleNewChange = (e) => {
        setNewCliente({ ...newCliente, [e.target.name]: e.target.value });
    };

    const handleEdit = (cliente) => {
        setEditingCliente(cliente);
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div className="error">Error: {error.message}</div>;

    return (
        <div className="container">
            <h1>Clientes</h1>

            <div>
                <h2>Agregar Cliente</h2>
                <input
                    type="text"
                    name="nombreCompleto"
                    placeholder="Nombre Completo"
                    value={newCliente.nombreCompleto}
                    onChange={handleNewChange}
                />
                <input
                    type="text"
                    name="documentoCliente"
                    placeholder="Documento Cliente"
                    value={newCliente.documentoCliente}
                    onChange={handleNewChange}
                />
                <input
                    type="text"
                    name="celular"
                    placeholder="Celular"
                    value={newCliente.celular}
                    onChange={handleNewChange}
                />
                <input
                    type="date"
                    name="fechaNacimiento"
                    value={newCliente.fechaNacimiento}
                    onChange={handleNewChange}
                />
                <button onClick={handleAdd}>
                    <i className="fas fa-plus"></i> Agregar
                </button>
            </div>

            <ul>
                {clientes.map((cliente) => (
                    <li key={cliente._id}>
                        <span>{cliente.nombreCompleto} - {cliente.documentoCliente} - {cliente.celular}</span>
                        <div>
                            <button className="edit" onClick={() => handleEdit(cliente)}>
                                <i className="fas fa-pencil-alt"></i> Editar
                            </button>
                            <button className="delete" onClick={() => handleDelete(cliente._id)}>
                                <i className="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {editingCliente._id && (
                <div>
                    <h2>Editar Cliente</h2>
                    <input
                        type="text"
                        name="nombreCompleto"
                        value={editingCliente.nombreCompleto}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="documentoCliente"
                        value={editingCliente.documentoCliente}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="celular"
                        value={editingCliente.celular}
                        onChange={handleChange}
                    />
                    <input
                        type="date"
                        name="fechaNacimiento"
                        value={editingCliente.fechaNacimiento}
                        onChange={handleChange}
                    />
                    <button onClick={handleUpdate}>
                        <i className="fas fa-save"></i> Actualizar
                    </button>
                </div>
            )}
        </div>
    );
};

export default ApiComponent;

