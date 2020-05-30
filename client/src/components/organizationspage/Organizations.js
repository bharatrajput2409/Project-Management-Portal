import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { getOrganizationsQuery } from "../../queries";

export default function Organizations() {
  const { loading, data, error } = useQuery(getOrganizationsQuery);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    console.log(error);
    return <h1>Error fetching organizations</h1>;
  }

  return (
    <div>
      {data.organizations.map((organization) => {
        return (
          <div key={organization.id}>
            <h3>{organization.name}</h3>
          </div>
        );
      })}
    </div>
  );
}
