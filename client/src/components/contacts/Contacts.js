import React, { useContext, Fragment, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Spinner from "../layout/Spinner";
import ContactItem from "./ContactItem";
import ContactContext from "../../context/contact/contactContext";

function Contacts() {
  const contactContext = useContext(ContactContext);

  const { contacts, filtered, getContacts } = contactContext;

  useEffect(() => {
    getContacts();
    // eslint-disable-next-line
  }, []);

  if (contacts !== null && contacts.length === 0) {
    return <h4>Please add a contact</h4>;
  }

  return (
    <Fragment>
      {contacts !== null ? (
        <TransitionGroup>
          {(filtered || contacts).map(contact => (
            <CSSTransition key={contact._id} timeout={500} classNames="item">
              <ContactItem contact={contact} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      ) : (
        <Spinner />
      )}
    </Fragment>
  );
}

export default Contacts;
