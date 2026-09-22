import React, { createContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const ToastContext = createContext();

export const useToast = (context) => {
  if (!context) {
    console.warn('useToast must be used within ToastProvider');
    return { show: () => {} };
  }
  return {
    show: (message, type = 'info', duration = 3000) => {
      context.showToast(message, type, duration);
    },
  };
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <View style={styles.container}>
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </View>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'info':
      default:
        return '#2196F3';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'alert';
      case 'info':
      default:
        return 'information';
    }
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons
          name={getIcon()}
          size={20}
          color="white"
          style={styles.icon}
        />
        <Text style={styles.message}>{toast.message}</Text>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.closeButton}>
        <MaterialCommunityIcons name="close" size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    zIndex: 999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 6,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
});
