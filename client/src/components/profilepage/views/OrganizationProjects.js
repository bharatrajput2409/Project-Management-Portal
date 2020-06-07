import React, { useState } from "react";
import Modal from "react-modal";
import { getOrganizationQuery, addOrgAdminMutation } from "../../../queries";
import OrgAdminForm from "../../forms/Mentor_nd_orgAdmin";
import { useQuery, useMutation } from "@apollo/react-hooks";
import AdminProjects from "./Projects";

export default function OrganizationProjects({ match }) {
  const {
    params: { orgId },
  } = match;

  const { loading, data, error } = useQuery(getOrganizationQuery, {
    variables: { org_id: orgId },
  });

  if (loading) return <h1>Loading...</h1>;

  if (error) {
    console.log(error);
    return <h1>Error occurred!</h1>;
  }

  const [orgAdminModal, setOrgAdminModal] = useState(false);

  const [addOrgAdmin] = useMutation(addOrgAdminMutation, {
    onError(err) {
      console.log(err);
    },
  });

  return (
    <div>
      {/* 
      X-Get the org id from params,
      X-Show org name
      X-Give add org admin button
      X-Display the admin project component
      */}
      <h1>{data.organization.name}</h1>
      <hr></hr>
      <button onClick={() => setOrgAdminModal(true)}>
        Add Organization Admin
      </button>
      <Modal
        isOpen={orgAdminModal}
        onRequestClose={() => {
          setOrgAdminModal(false);
        }}
        contentLabel="OrgAdminModal"
      >
        <div className="modalContent">
          <button
            className="closeModal"
            onClick={() => {
              setOrgAdminModal(false);
            }}
            style={{
              background: "none",
              border: "none",
              fontSize: "36px",
            }}
          >
            x
          </button>
          <OrgAdminForm
            mutation={addOrgAdmin}
            orgId={[orgId]}
            setState={setOrgAdminModal}
          />
        </div>
      </Modal>
      <AdminProjects projects={data.organization.projects} />
    </div>
  );
}
