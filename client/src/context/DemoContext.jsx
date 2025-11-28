import { createContext, useContext, useState, useEffect } from 'react';

const DemoContext = createContext(null);

// Demo users from backend
const demoUsers = {
  student1: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@student.mit.edu',
    role: 'student',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    did: 'did:ethr:0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    organization: 'Massachusetts Institute of Technology',
    isVerified: true
  },
  student2: {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane.smith@student.stanford.edu',
    role: 'student',
    walletAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    did: 'did:ethr:0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
    organization: 'Stanford University',
    isVerified: true
  },
  student3: {
    id: 'user-3',
    name: 'Alice Johnson',
    email: 'alice.johnson@student.harvard.edu',
    role: 'student',
    walletAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    did: 'did:ethr:0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    organization: 'Harvard University',
    isVerified: true
  },
  university1: {
    id: 'user-4',
    name: 'MIT Registrar',
    email: 'registrar@mit.edu',
    role: 'university',
    walletAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    did: 'did:ethr:0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    organization: 'Massachusetts Institute of Technology',
    isVerified: true
  },
  university2: {
    id: 'user-5',
    name: 'Stanford Credentials Office',
    email: 'credentials@stanford.edu',
    role: 'university',
    walletAddress: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    did: 'did:ethr:0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    organization: 'Stanford University',
    isVerified: true
  },
  employer: {
    id: 'user-7',
    name: 'Tech Corp HR',
    email: 'hr@techcorp.com',
    role: 'employer',
    walletAddress: '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
    did: 'did:ethr:0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
    organization: 'Tech Corp',
    isVerified: true
  }
};

export const DemoProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored demo user
    const storedUser = localStorage.getItem('demoUser');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const selectRole = (roleKey) => {
    const selectedUser = demoUsers[roleKey];
    if (selectedUser) {
      setUser(selectedUser);
      localStorage.setItem('demoUser', JSON.stringify(selectedUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid role' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demoUser');
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('demoUser', JSON.stringify(newUser));
  };

  const value = {
    user,
    loading,
    selectRole,
    logout,
    updateUser,
    isAuthenticated: !!user,
    demoUsers
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

export default DemoContext;
