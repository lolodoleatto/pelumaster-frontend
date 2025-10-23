import React, { useState } from 'react';
import Navbar from '../components/NavBar';
import TurnosList from '../components/TurnosList';
import TurnoForm from '../components/TurnoForm'; // Importar el nuevo formulario
import { Container, Typography, Button, Box, Modal, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Turnos: React.FC = () => {
    // Estado para controlar la apertura/cierre del modal del formulario
    const [openForm, setOpenForm] = useState(false);
    
    // Necesitamos una referencia a la función refetch del TurnosList
    // Para simplificar, simplemente recargaremos la página de turnos
    // ya que TurnosList tiene su propia lógica de refetch a través del hook.
    
    // La función onSuccess simplemente cierra el modal
    const handleSuccess = () => {
        setOpenForm(false);
        // NOTA: Si TurnosList usa useFetch, el refetch se activará al montarse de nuevo
        // o si pasamos la función refetch del hook al Turnos.tsx.
        // Como TurnosList usa su propio useFetch, la forma más simple es confiar en que 
        // el componente se recargará si se vuelve a montar o, si el componente queda
        // montado, necesitamos pasarle un prop de recarga.
        
        // ¡Simplificamos! El componente TurnosList ya tiene el refetch en su hook.
        // Si usamos una clave (key) en TurnosList, forzamos la recarga:
        setListKey(prev => prev + 1);
    };
    
    // 💡 TÉCNICA CLAVE: Forzar recarga de TurnosList usando 'key'
    const [listKey, setListKey] = useState(0); 

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" component="h1">
                        Turnos Agendados
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<AddIcon />}
                        onClick={() => setOpenForm(true)}
                    >
                        Agendar Nuevo Turno
                    </Button>
                </Box>
                
                {/* Lista de Turnos: Usamos la clave para forzar el re-renderizado después de un POST exitoso */}
                <TurnosList key={listKey} />

                {/* Modal para el Formulario */}
                <Modal
                    open={openForm}
                    onClose={() => setOpenForm(false)}
                    aria-labelledby="modal-title"
                >
                    <Box sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        width: { xs: '90%', md: 600 }, 
                        bgcolor: 'background.paper', 
                        boxShadow: 24, 
                        p: 4, 
                        borderRadius: 2
                    }}>
                        <Typography id="modal-title" variant="h5" component="h2" mb={3}>
                            Agendar Nuevo Turno
                        </Typography>
                        <TurnoForm 
                            onSuccess={handleSuccess} 
                            onClose={() => setOpenForm(false)} 
                        />
                    </Box>
                </Modal>
            </Container>
        </>
    );
};

export default Turnos;