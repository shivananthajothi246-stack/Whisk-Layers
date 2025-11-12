import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Home(){
  const [products, setProducts] = useState([]);
  const [bakeries, setBakeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(()=> {
    const fetch = async () => {
      try {
        // Fetch both products and bakeries
        const [productsRes, bakeriesRes] = await Promise.all([
          API.get("/products").catch(() => ({ data: [] })),
          API.get("/bakeries").catch(() => ({ data: [] }))
        ]);

        if (productsRes.data && productsRes.data.length > 0) {
          setProducts(productsRes.data);
        } else {
          setProducts([
            { _id: "p1", name: "Chocolate Dream Cake", description:"Rich chocolate layers with ganache", price:1200, image:"/images/cake1.jpg", customizable: true },
            { _id: "p2", name: "Strawberry Delight", description:"Fresh strawberries with cream", price:1300, image:"/images/cake2.jpg", customizable: true },
            { _id: "p3", name: "Vanilla Classic", description:"Smooth vanilla with buttercream", price:900, image:"/images/cake3.jpg", customizable: true },
            { _id: "p4", name: "Red Velvet Supreme", description:"Creamy red velvet with cream cheese", price:1500, image:"/images/cake4.jpg", customizable: true },
            { _id: "p5", name: "Blueberry Cheesecake", description:"Tangy & sweet blueberry delight", price:1100, image:"/images/cake5.jpg", customizable: true },
            { _id: "p6", name: "Lemon Drizzle", description:"Zesty & light lemon cake", price:1000, image:"/images/cake6.jpg", customizable: true },
            { _id: "p7", name: "Black Forest", description:"Chocolate & cherries masterpiece", price:1400, image:"/images/cake7.jpg", customizable: true },
            { _id: "p8", name: "Nutty Brownie", description:"Rich chocolate brownie", price:700, image:"/images/cake8.jpg", customizable: true },
            { _id: "p9", name: "Tiramisu", description:"Italian coffee-flavored dessert", price:1600, image:"/images/cake1.jpg", customizable: true },
            { _id: "p10", name: "Carrot Cake", description:"Spiced carrot cake with cream cheese", price:950, image:"/images/cake2.jpg", customizable: true },
            { _id: "p11", name: "Opera Cake", description:"French layered cake", price:1700, image:"/images/cake3.jpg", customizable: true },
            { _id: "p12", name: "Mille Feuille", description:"Puff pastry dessert", price:1650, image:"/images/cake6.jpg", customizable: true },
            { _id: "p13", name: "Success Cake", description:"Almond meringue cake", price:1800, image:"/images/success.png", customizable: true }
          ]);
        }

        if (bakeriesRes.data && bakeriesRes.data.length > 0) {
          setBakeries(bakeriesRes.data);
        } else {
          setBakeries([
            { _id: "b1", name: "Sweet Treats Bakery", location: "City Center", image: "/images/bakery1.jpg" },
            { _id: "b2", name: "Cake Corner", location: "Market Street", image: "/images/bakery2.jpg" },
            { _id: "b3", name: "Golden Oven", location: "North Side", image: "/images/bakery3.jpg" },
            { _id: "b4", name: "Choco House", location: "Mall Road", image: "/images/bakery4.jpg" },
            { _id: "b5", name: "Cake Cottage", location: "River Road", image: "/images/bakery5.jpg" },
            { _id: "b6", name: "Heavenly Bakes", location: "Oak Avenue", image: "/images/bakery6.jpg" },
            { _id: "b7", name: "Sunrise Sweets", location: "Sunset Boulevard", image: "/images/bakery1.jpg" },
            { _id: "b8", name: "Royal Cakes", location: "King's Street", image: "/images/bakery2.jpg" }
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

  const isFallback = products.length > 0 && products[0]._id && products[0]._id.startsWith('p');

  return (
    <main className="page container">
      {/* Hero Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '40px',
        marginBottom: '60px',
        padding: '40px 0'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: '48px',
            color: '#8b1533',
            marginBottom: '16px',
            fontWeight: '800',
            lineHeight: '1.2'
          }}>
            Delightful Crafted Creations
          </h1>
          <p style={{
            color: '#6b6b6b',
            fontSize: '18px',
            lineHeight: '1.6',
            marginBottom: '24px'
          }}>
            Choose handcrafted cakes and sweets from local bakers. Customize & order easily with our premium delivery service.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              className="btn" 
              onClick={() => {
                const token = localStorage.getItem('token');
                if (!token) window.location = '/login';
                else window.location = '/bakeries';
              }}
              style={{
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              Shop Now
            </button>
            <button 
              onClick={() => window.location = '/bakeries'}
              style={{
                background: 'transparent',
                border: '2px solid #8b1533',
                color: '#8b1533',
                padding: '16px 32px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            >
              Browse Bakeries
            </button>
          </div>
        </div>
        <div style={{
          width: '400px',
          display: window.innerWidth < 800 ? 'none' : 'block'
        }}>
          <img 
            src="/images/cake1.jpg" 
            alt="hero" 
            style={{
              width: '100%',
              borderRadius: '20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }} 
          />
        </div>
      </div>

      {/* Featured Bakeries */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{
          fontSize: '32px',
          color: '#8b1533',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Featured Bakeries
        </h2>
        <div className="card-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {bakeries.map(bakery => (
            <div 
              key={bakery._id} 
              className="card" 
              onClick={() => window.location = `/bakery/${bakery._id}`}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={bakery.image?.startsWith('/') ? bakery.image : `/images/${bakery.image}`} 
                alt={bakery.name}
                style={{ height: '200px' }}
              />
              <div className="card-body">
                <div className="card-title">{bakery.name}</div>
                <div style={{ color: '#6b6b6b', marginBottom: '12px' }}>{bakery.location}</div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location = `/bakery/${bakery._id}`;
                  }} 
                  className="btn"
                  style={{ width: '100%' }}
                >
                  View Products
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section style={{
        marginTop: '60px',
        textAlign: 'center',
        padding: '40px',
        background: 'linear-gradient(135deg, #fff0f2 0%, #f8f9fa 100%)',
        borderRadius: '20px',
        border: '1px solid #f1e6e9'
      }}>
        <h3 style={{
          fontSize: '28px',
          color: '#8b1533',
          marginBottom: '16px'
        }}>
          Ready to Order?
        </h3>
        <p style={{
          color: '#6b6b6b',
          fontSize: '16px',
          marginBottom: '24px'
        }}>
          Browse our selection of bakeries and place your order today!
        </p>
        <button 
          className="btn"
          onClick={() => window.location = '/bakeries'}
          style={{
            padding: '16px 32px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          Start Shopping
        </button>
      </section>
    </main>
  );
}
