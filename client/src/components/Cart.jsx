import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTrash, FaCog, FaPlus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import '../styles/Cart.css';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [orderNumber, setOrderNumber] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
        // Check if there's an existing order number in localStorage
        const existingOrderNumber = localStorage.getItem('currentOrderNumber');
        if (existingOrderNumber) {
            setOrderNumber(existingOrderNumber);
        } else {
            generateOrderNumber();
        }
    }, []);

    const generateOrderNumber = () => {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const newOrderNumber = `${year}${month}${day}${random}`;
        setOrderNumber(newOrderNumber);
        // Store the order number in localStorage so checkout can use it
        localStorage.setItem('currentOrderNumber', newOrderNumber);
    };

    const updateQuantity = (index, change) => {
        const updatedCart = [...cartItems];
        const newQuantity = (updatedCart[index].quantity || 1) + change;
        
        if (newQuantity > 0) {
            updatedCart[index].quantity = newQuantity;
            setCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    const removeItem = (index) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleCustomize = (index) => {
        const item = cartItems[index];
        navigate(`/customize/${item.category}/${item._id}`, {
            state: { beverage: item }
        });
    };

    const getImagePath = (item) => {
        const imageMap = {
            coffee: {
                'Espresso': 'espresso.png',
                'Americano': 'americano.png',
                'Flat White': 'flat-white.png',
                'Cappuccino': 'cappuccino.png'
            },
            shakes: {
                'Berry Blast Smoothie': 'berryblast.jpg',
                'Tropical Smoothie': 'tropicalsmoothie.jpg',
                'Green Smoothie': 'greensmoothie.jpg',
                'Banana Shake': 'bananashake.jpg'
            },
            tea: {
                'Chai Latte': 'chailatte.jpg',
                'Classic Black Tea': 'classicblacktea.jpg',
                'Green Tea': 'greentea.jpg',
                'Matcha Latte': 'matchalatte.jpg'
            },
            bubbleTea: {
                'Brown Sugar Milk Tea': 'brownsugarmilktea.jpg',
                'Matcha Bubble Tea': 'matchabubbletea.jpg',
                'Tea Popping Boba': 'teapoppingboba.jpg',
                'Thai Bubble Tea': 'thaibubbletea.jpg'
            }
        };

        const categoryMap = imageMap[item.category] || {};
        const imageName = categoryMap[item.name] || 'default.jpg';
        return `/images/${item.category}/${imageName}`;
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleBack = () => {
        // If we came from customizing an item, go back to that item's customize page
        if (location.state?.from === 'customize' && location.state?.category && location.state?.beverageId) {
            navigate(`/customize/${location.state.category}/${location.state.beverageId}`);
        } else {
            // Otherwise, go to the main menu
            navigate('/coffee');
        }
    };

    return (
        <>
            <div className="cart-header">
                <button 
                    className="back-button" 
                    onClick={handleBack}
                    style={{ marginTop: '-40px' }}
                >
                    <FaArrowLeft style={{ fontSize: '1rem', color: 'white' }} />
                </button>
                <h1 className="page-title" style={{ marginTop: '-30px' }}>Cart</h1>
                <div style={{
                    position: 'absolute',
                    top: '-95px',
                    right: '-8rem',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    marginLeft: 'auto',
                    width: 'auto',
                    whiteSpace: 'nowrap',
                    overflow: 'visible',
                    transform: 'translateX(-110px)'
                }}>
                    <span style={{ 
                        fontSize: '1.5rem', 
                        marginRight: '0.3rem',
                        display: 'inline-block'
                    }}>🍵</span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ 
                            fontSize: '1.2rem', 
                            fontWeight: 'bold',
                            color: '#E4794A'
                        }}>Cafe</span>
                        <span style={{ 
                            fontSize: '1.2rem', 
                            fontWeight: 'bold',
                            color: '#6E7061',
                            marginLeft: '4px'
                        }}>Asipiya</span>
                    </div>
                </div>
            </div>
            <div className="cart-wrapper">
                <div className="floating-cart">
                    {cartItems.map((item, index) => (
                        <div key={index} className="cart-item-card">
                            <div className="cart-item-image">
                                <img 
                                    src={getImagePath(item)}
                                    alt={item.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `/images/${item.category}/default.jpg`;
                                    }}
                                />
                            </div>
                            <div className="cart-item-details">
                                <div className="cart-item-header">
                                    <div className="cart-item-info">
                                        <h3>{item.name}</h3>
                                        <p className="customizations">
                                            customized - {item.milk}
                                            {item.syrup && `, ${item.syrup}`}
                                        </p>
                                    </div>
                                    <div className="cart-item-actions">
                                        <button 
                                            className="action-button"
                                            onClick={() => handleCustomize(index)}
                                        >
                                            <FaCog />
                                        </button>
                                        <button 
                                            className="action-button delete"
                                            onClick={() => removeItem(index)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                <div className="quantity-controls">
                                    <button 
                                        className="quantity-button"
                                        onClick={() => updateQuantity(index, -1)}
                                    >
                                        -
                                    </button>
                                    <span className="quantity">{item.quantity || 1}</span>
                                    <button 
                                        className="quantity-button"
                                        onClick={() => updateQuantity(index, 1)}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-summary-table">
                    <div className="table-header">
                        <span>Item</span>
                        <span>QTY</span>
                        <span>Price</span>
                        <span>Amount</span>
                    </div>
                    {cartItems.map((item, index) => (
                        <div key={index} className="table-row">
                            <span className="item-name">{item.name}</span>
                            <span className="item-qty">{item.quantity || 1}</span>
                            <span className="item-price">${item.price.toFixed(2)}</span>
                            <span className="item-amount">${((item.quantity || 1) * item.price).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="order-details">
                        <div className="detail-row">
                            <span>Order</span>
                            <span>#{orderNumber}</span>
                        </div>
                        <div className="detail-row">
                            <span>Time</span>
                            <span>15 min</span>
                        </div>
                        <div className="detail-row total-row">
                            <span>Total</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>
                    <button className="checkout-button" onClick={handleCheckout}>
                        Check Out <FaShoppingCart />
                    </button>
                </div>
                <div className="add-drink-container">
                    <button 
                        className="add-drink-button" 
                        onClick={() => navigate('/coffee')}
                    >
                        <FaPlus size={24} />
                    </button>
                </div>
            </div>
        </>
    );
}

export default Cart; 