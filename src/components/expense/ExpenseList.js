

const ExpenseList = ({expenses}) => {
    
  return (
    <div><ul>
            {expenses.map((exp) => (
              <li key={exp.id}>
                ₹{exp.amount} - {exp.description} ({exp.category})
              </li>
            ))}
          </ul></div>
  )
}

export default ExpenseList