import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PropsTypes from 'prop-types';

const useStatefulModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalState, setModalState] = useState({});

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const Modal = ({ children }) => {
        return (
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key={"state_modal"}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0 }}
                        onClick={closeModal}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <motion.div
                            key={"state_modal_inner"}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            initial={{ scale: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                backgroundColor: 'white',
                                padding: '2rem',
                                borderRadius: '0.5rem',
                            }}
                        >
                            {children({modalState, setModalState, closeModal})}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };

    Modal.propTypes = {
        children: PropsTypes.node.isRequired,
    };

    return {
        isOpen,
        openModal,
        closeModal,
        setModalState,
        modalState,
        Modal,
    };
};

export default useStatefulModal;
