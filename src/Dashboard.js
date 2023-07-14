import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

function Dashboard() {
  const handleLogout = () => {
    logout();
  };

  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [counters, setCounters] = useState([{ value: 0, label: "" }]);

  const handleButtonClick = (counterIndex, operation) => {
    setCounters((prevCounters) => {
      return prevCounters.map((counter, index) => {
        if (index === counterIndex) {
          let updatedValue = counter.value;
          if (operation === "+") {
            updatedValue += 1;
          } else if (operation === "-") {
            updatedValue -= 1;
          } else if (operation === "reset") {
            updatedValue = 0;
          }
          return { ...counter, value: updatedValue };
        }
        return counter;
      });
    });
  };
  

  const addCounter = () => {
    setCounters((prevCounters) => [
      ...prevCounters,
      { value: 0, label: "" }
    ]);
  };

  const removeCounter = (counterIndex) => {
    setCounters((prevCounters) => {
      const updatedCounters = [...prevCounters];
      updatedCounters.splice(counterIndex, 1);
      return updatedCounters;
    });
  };

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user, loading]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar__container">
          <Link to="/" className="navbar__logo">
            Your Logo
          </Link>
          <div className="navbar__user">
            <span className="navbar__userName">{name}</span>
          </div>
          <button className="navbar__btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="container">
        <div className="counter">
          {counters.map((counter, index) => (
            <div className="counter__item" key={index}>
              <div className="counter__value">{counter.value}</div>
              <div className="counter__buttons">
                <button
                  className="counter__button"
                  onClick={() => handleButtonClick(index, "+")}
                >
                  +
                </button>
                <button
                  className="counter__button"
                  onClick={() => handleButtonClick(index, "-")}
                >
                  -
                </button>
                <button
                  className="counter__button"
                  onClick={() => handleButtonClick(index, "reset")}
                >
                  Reset
                </button>
                <button
                  className="counter__button"
                  onClick={() => removeCounter(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="add-counter__button" onClick={addCounter}>
          Add Counter
        </button>
      </div>
    </>
  );
}

export default Dashboard;
