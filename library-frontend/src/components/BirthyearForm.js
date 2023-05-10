import { useState } from "react";
import { SET_BIRTHYEAR } from "../queries";
import { useMutation } from "@apollo/client";

const BirthyearForm = (props) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [setBirthyear] = useMutation(SET_BIRTHYEAR);

  const submit = async (event) => {
    event.preventDefault();

    setBirthyear({ variables: { name, setBornTo: Number(born) } });
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {props.authors.map((a) => (
              <option key={a.name}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
          <div>
            <button type="submit">update author</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BirthyearForm;
