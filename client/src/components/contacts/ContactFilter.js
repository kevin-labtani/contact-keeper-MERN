import React, { useContext, useState } from "react";
import ContactContext from "../../context/contact/contactContext";

const ContactFilter = () => {
  const [text, setText] = useState("");
  const contactContext = useContext(ContactContext);

  const { filterContacts, clearFilter } = contactContext;

  const onChange = e => {
    setText(e.target.value);

    if (e.target.value !== "") {
      filterContacts(text);
    } else {
      clearFilter();
    }
  };

  return (
    <form>
      <input
        type="text"
        placeholder="Filter Contacts..."
        onChange={onChange}
        value={text}
      />
    </form>
  );
};

export default ContactFilter;
