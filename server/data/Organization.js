const { dbQuery } = require("../config/db");
const { GraphQLError } = require("graphql");

const getOrganizations = function (year) {
	if(year == null) {
		year = new Date().getFullYear();
	}
	return dbQuery("CALL get_orgs_by_year(?)", [year]).then((data) => data);
};

const addOrganization = function (name, description, user) {
	if (user.type == "superAdmin") {
		const year = new Date().getFullYear();
		return dbQuery("CALL add_organization(?,?,?)", [name, year, description]).then(
			(data) => data[0],
			(error) => new GraphQLError(error)
		);
	}
	return new GraphQLError("Insufficient permissions.");
};

const deleteOrganization = function (orgID, user) {
	if (user.type == "superAdmin") {
		return dbQuery("CALL delete_organization(?)", [orgID]).then(
			() => true,
			(error) => new GraphQLError(error)
		);
	}
	return new GraphQLError("Insufficient permissions.");
};

const OrganizationResolvers = {
	id: (parent) =>
		dbQuery("SELECT org_id FROM organizations WHERE org_id = (?)", [
			parent.org_id
		]).then((data) =>
			data ? data.org_id : new GraphQLError("No such entry")
		),
	name: (parent) =>
		dbQuery("SELECT org_name FROM organizations WHERE org_id = (?)", [
			parent.org_id
		]).then((data) =>
			data ? data.org_name : new GraphQLError("No such entry")
		),
	description: (parent) =>
		dbQuery("SELECT description FROM organizations WHERE org_id = (?)", [
			parent.org_id
		]).then((data) =>
			data ? data.description : new GraphQLError("No such entry")
		),
	projects: (parent) =>
		dbQuery("CALL get_projects_by_org(?)", [parent.org_id]).then((data) =>
			data ? data : new GraphQLError("No such entry")
		),
	mentors: (parent) =>
		dbQuery("CALL get_mentors_by_org(?)", [parent.org_id]).then((data) =>
			data ? data : new GraphQLError("No such entry")
		),
	OrgAdmins: (parent) =>
		dbQuery("CALL get_org_admins_by_org_id(?)", [
			parent.org_id
		]).then((data) => (data ? data : new GraphQLError("No such entry")))
};

module.exports = {
	getOrganizations,
	addOrganization,
	deleteOrganization,
	OrganizationResolvers
};
