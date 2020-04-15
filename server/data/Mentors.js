const { dbQuery } = require("../config/db");
const { GraphQLError } = require("graphql");


const getMentors = function(year, orgID) {
	if(year == null) year = new Date().getFullYear();
	return dbQuery("CALL get_mentors_by_org(?)", [orgID]).then((data) => data);
};

const addMentor = function(email, name, password, org_id) {
	const year = new Date().getFullYear();
	const setAutoCommit = () =>  { return dbQuery("SET AUTOCOMMIT=0").then(() => startTransaction(), (err) => new GraphQLError(err)); };
	const startTransaction = () => { return dbQuery("BEGIN").then(() => addMentorToMentors(email, name, password, year), (err) => new GraphQLError(err)); };
	const addMentorToMentors = (email, name, password, year) => { return dbQuery("CALL add_mentor(?,?,?,?)", [email, name, password, year]).then((data) => addMentorOrgs(data[0].mentor_id, org_id.length), (error) => rollbackTransaction(error)); };
	const addMentorOrgs = (mentor_id, org_id_length) => { if(org_id_length > 0) return dbQuery("CALL add_mentor_belongs_to(?,?)", [mentor_id, parseInt(org_id[org_id_length - 1])]).then(() => addMentorOrgs(mentor_id, (org_id_length)-1), (error) => rollbackTransaction(error)); else if(org_id_length == 0) return commitTransaction(mentor_id); };
	const commitTransaction = (mentor_id) => { return dbQuery("COMMIT").then(() => { return { "mentor_id": mentor_id }; }, (error) => new GraphQLError(error)); };
	const rollbackTransaction = (error) => { return dbQuery("ROLLBACK").then(() => new GraphQLError(error), (error) => new GraphQLError(error)); };
	return setAutoCommit();
};

const deleteMentor = function(mentorID) {
	const setAutoCommit = () =>  { return dbQuery("SET AUTOCOMMIT=0").then(() => startTransaction(), (err) => new GraphQLError(err)); };
	const startTransaction = () => { return dbQuery("BEGIN").then(() => deleteMentor(mentorID), (err) => new GraphQLError(err)); };
	const deleteMentor = (mentorID) => { return dbQuery("CALL delete_mentor(?)", [mentor_id]).then((data) => addMentorOrgs(data[0].mentor_id, org_id.length), (error) => rollbackTransaction(error)); };
	const getProjectsFromMentor = (mentor_id) => { return dbQuery("SELECT project_id FROM Mentored_By WHERE mentor_id = (?)", [mentor_id]); };
	const checkProjectValidity = (mentor_id, project_id) => { return dbQuery("CALL get_mentors_by_project(?)", )}

	const addMentorOrgs = (mentor_id, org_id_length) => { if(org_id_length > 0) return dbQuery("CALL add_mentor_belongs_to(?,?)", [mentor_id, parseInt(org_id[org_id_length - 1])]).then(() => addMentorOrgs(mentor_id, (org_id_length)-1), (error) => rollbackTransaction(error)); else if(org_id_length == 0) return commitTransaction(mentor_id); };
	const commitTransaction = (mentor_id) => { return dbQuery("COMMIT").then(() => { return { "mentor_id": mentor_id }; }, (error) => new GraphQLError(error)); };
	const rollbackTransaction = (error) => { return dbQuery("ROLLBACK").then(() => new GraphQLError(error), (error) => new GraphQLError(error)); };
	return setAutoCommit();
};

const MentorResolvers = {
	id: (parent) => dbQuery("SELECT mentor_id FROM Mentors WHERE Mentors.mentor_id = (?)", [parent.mentor_id]).then((data) => data ? data.mentor_id : new GraphQLError("No such entry")),  
	email: (parent) => dbQuery("SELECT email FROM Mentors WHERE Mentors.mentor_id = (?)", [parent.mentor_id]).then((data) => data ? data.email : new GraphQLError("No such entry")), 
	name: (parent) => dbQuery("SELECT mentor_name FROM Mentors WHERE Mentors.mentor_id = (?)", [parent.mentor_id]).then((data) => data ? data.mentor_name  : new GraphQLError("No such entry")),
	absolute_year: (parent) => dbQuery("SELECT absolute_year FROM Mentors WHERE Mentors.mentor_id = (?)", [parent.mentor_id]).then((data) => data ? data.absolute_year : new GraphQLError("No such entry")),
	organization: (parent) => dbQuery("CALL get_mentors_orgs(?)", [parent.mentor_id]).then((data) => data ? data : new GraphQLError("No such entry")),
	projects: (parent) => dbQuery("CALL get_projects_by_mentor(?)", [parent.mentor_id]).then((data) => data? data : new GraphQLError("No such entry")),
};

module.exports = {getMentors, addMentor, deleteMentor, MentorResolvers};
