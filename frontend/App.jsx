function App() {
    const [formData,setFormData] = React.useState({
        tenure_months: 12,
        monthly_charges: 65.0,
        support_tickets: 1,
        contract_type_year: 1,
    });
    const[result,setResult] = React.useState(null);
    const[loading,setLoading] = React.useState(false);
    const[error,setError] = React.useState(null);
    const handleInputChange = (field,value) => {
        setFormData((prevData) => ({ ...prevData,[field]: value}));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try{
            const response = await fetch('http://localhost:8000/predict',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)

            });
            if(!response.ok) {
                throw new Error('FastAPI server error: HTTP status ${response.status}');
            }
            const data = await response.json();
            setResult(data);
        } catch(err){
            setError(err.message || 'Unable to connect to FastAPI server on http://localhost:8000');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div style={{
      minHeight: '100vh',                
      backgroundColor: '#0f172a',         
      color: '#ffffff',                  
      display: 'flex',                   
      alignItems: 'center',              
      justifyContent: 'center',          
      padding: '24px',                   
      fontFamily: 'system-ui, sans-serif'
    }}>
        <div style={{
            maxWidth: '500px',
            width: '100%',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3'
        }}>
            <div style={{ marginBottom: '24px'}}>
                <h1 style={{ fontsize: '24px',fontWeight: 'bold',color: '#60a5fa',margin: '0 0 4px 0'}}>
                    Risk Intelligence
                </h1>
                <p style={{ fontsize: '14px',color: '94a3b8',margin:0 }}>
                    Enterprise Customer Churn AI Engine
    
                    
                </p>
            </div>
            
        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#cbd5e1', marginBottom: '6px' }}>
              Tenure (Months)
            </label>
            <input 
              type="number"              
              min="1"                     
              value={formData.tenure_months} 
              onChange={(e) => handleInputChange('tenure_months', parseInt(e.target.value) || 0)} 
              style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }}
              required                   
            />
          </div>

          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#cbd5e1', marginBottom: '6px' }}>
              Monthly Charges ($)
            </label>
            <input 
              type="number"              
              step="0.1"                
              min="0.1"                   
              value={formData.monthly_charges} 
              onChange={(e) => handleInputChange('monthly_charges', parseFloat(e.target.value) || 0.0)} // Update state on change
              style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }}
              required                   
            />
          </div>

          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#cbd5e1', marginBottom: '6px' }}>
              Support Tickets Opened
            </label>
            <input 
              type="number"             
              min="0"                     
              value={formData.support_tickets} 
              onChange={(e) => handleInputChange('support_tickets', parseInt(e.target.value) || 0)} 
              style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }}
              required                   
            />
          </div>

          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#cbd5e1', marginBottom: '6px' }}>
              Contract Type
            </label>
            <select 
              value={formData.contract_type_year} // Bind select menu to React state
              onChange={(e) => handleInputChange('contract_type_year', parseInt(e.target.value))} 
              style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }}
            >
              <option value={1}>Annual Contract</option>
              <option value={0}>Month-to-Month Contract</option>
            </select>
          </div>

          
          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: loading ? '#3b82f680' : '#2563eb', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              marginTop: '8px',
              fontSize: '14px'
            }}
          >
            
            {loading ? 'Evaluating ML Model...' : 'Analyze Customer Risk'}
          </button>
        </form>

        
        {error && (
          <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#f87171', borderRadius: '6px', fontSize: '14px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        
        {result && (
          <div style={{ marginTop: '24px', borderTop: '1px solid #334155', paddingTop: '16px' }}>
           
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#94a3b8' }}>Risk Score:</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#60a5fa' }}>
                {(result.risk_score * 100).toFixed(1)}%
              </span>
            </div>

            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: '#94a3b8' }}>Risk Classification:</span>
              <span style={{ 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontSize: '12px', 
                fontWeight: 'bold',
                color: result.risk_tier === 'CRITICAL' ? '#f87171' : result.risk_tier === 'MODERATE' ? '#facc15' : '#4ade80',
                backgroundColor: result.risk_tier === 'CRITICAL' ? 'rgba(239,68,68,0.2)' : result.risk_tier === 'MODERATE' ? 'rgba(234,179,8,0.2)' : 'rgba(34,197,94,0.2)'
              }}>
                {result.risk_tier}
              </span>
            </div>

            
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', border: '1px solid #334155' }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                Prescriptive Recommendation
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: '#e2e8f0' }}>
                {result.recommended_action}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

            