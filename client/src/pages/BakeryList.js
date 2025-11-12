import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function BakeryList(){
  const [bakeries, setBakeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(()=> {
    const fetch = async () => {
      try {
        const res = await API.get("/bakeries");
        if (res.data && res.data.length > 0) setBakeries(res.data);
        else {
          // fallback 6 bakeries with images
          setBakeries([
            { _id:'b1', name:'Sweet Treats', location:'City Center', image:'/images/bakery1.jpg' },
            { _id:'b2', name:'Cake Corner', location:'Market Street', image:'/images/bakery2.jpg' },
            { _id:'b3', name:'Golden Oven', location:'North Side', image:'/images/bakery3.jpg' },
            { _id:'b4', name:'Choco House', location:'Mall Road', image:'/images/bakery4.jpg' },
            { _id:'b5', name:'Cake Cottage', location:'River Road', image:'/images/bakery5.jpg' },
            { _id:'b6', name:'Heavenly Bakes', location:'Oak Avenue', image:'/images/bakery6.jpg' }
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <main className="page container">
      <h1 style={{color:'#8b1533', textAlign:'center'}}>Choose a bakery</h1>
      {loading ? <div style={{padding:40}}>Loading bakeries...</div> : (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div className="card-container" style={{ justifyContent: 'center', display: 'flex', flexWrap: 'wrap', gap: '32px', maxWidth: '1000px' }}>
            {bakeries.map(b => (
              <div key={b._id} className="card" style={{ minWidth: 260, maxWidth: 320, boxShadow: '0 4px 18px rgba(139,21,51,0.07)', border: '1.5px solid #f1e6e9', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onClick={() => window.location = `/bakery/${b._id}`}> 
                <img src={b.image.startsWith('/')?b.image:`/images/${b.image}`} alt={b.name} style={{ height: 180, objectFit: 'cover', borderRadius: '10px 10px 0 0', borderBottom: '1.5px solid #f1e6e9' }} />
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20 }}>
                  <div className="card-title" style={{ fontSize: 22, marginBottom: 6 }}>{b.name}</div>
                  <div style={{color:'#6b6b6b', fontSize: 15, marginBottom: 12}}>{b.location}</div>
                  <button className="btn" style={{ width: '100%', marginTop: 8, fontSize: 15, borderRadius: 6 }} onClick={(e)=>{ e.stopPropagation(); window.location=`/bakery/${b._id}` }}>View products</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}