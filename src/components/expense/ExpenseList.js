import React from 'react';

const ExpenseList = ({ expenses, onDelete }) => {
  return (
    <div>
      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            ₹{exp.amount} - {exp.description} ({exp.category}){" "}
            <button onClick={() => onDelete(exp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
