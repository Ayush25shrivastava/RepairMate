import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const IssueContext = createContext();

export const IssueProvider = ({ children }) => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(false);

  const issueApi = '/api/v1/issues';
  const adminApi = '/api/v1/admin';
  const authHeaders = user?.token ? { Authorization: `Bearer ${user.token}` } : {};

  // Fetch Issues on Mount or User Change
  useEffect(() => {
    if (!user) return;
    
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchIssues(),
          user.role === 'admin' ? fetchEngineers() : Promise.resolve()
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [user]);

  const fetchIssues = async () => {
    try {
      let url = issueApi;
      if (user.role === 'admin') url = `${issueApi}/`;
      else if (user.role === 'engineer') url = `${issueApi}/engineer-issues`;
      else url = `${issueApi}/my-issues`;

      const res = await fetch(url, { headers: { ...authHeaders } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to sync with Hub');
      setIssues(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Hub Sync Failed: ' + err.message);
    }
  };

  const fetchEngineers = async () => {
    try {
      const res = await fetch(`${adminApi}/engineers`, { headers: { ...authHeaders } });
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to load Ops team');
      setEngineers(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const createIssue = async (formData) => {
    try {
      // formData should be a FormData object if containing file, or JSON
      const isFormData = formData instanceof FormData;
      
      const res = await fetch(`${issueApi}/create`, {
        method: 'POST',
        headers: {
          ...authHeaders,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        },
        body: isFormData ? formData : JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Malfunction Report Failed');
      
      setIssues(prev => [data.data, ...prev]);
      toast.success('Malfunction Logged');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const assignEngineer = async (issueId, engineerId) => {
    try {
      const res = await fetch(`${issueApi}/${issueId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ engineerId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Assignment Failed');

      setIssues(prev => prev.map(i => i._id === issueId ? data.data : i));
      toast.success('Ops Team Assigned');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateStatus = async (issueId, status) => {
    try {
      const res = await fetch(`${issueApi}/${issueId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Status Update Failed');

      setIssues(prev => prev.map(i => i._id === issueId ? data.data : i));
      toast.success('Status Logged');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <IssueContext.Provider value={{ 
      issues, 
      engineers, 
      loading, 
      createIssue, 
      assignEngineer, 
      updateStatus,
      refresh: fetchIssues 
    }}>
      {children}
    </IssueContext.Provider>
  );
};

export const useIssue = () => useContext(IssueContext);
