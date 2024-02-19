const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index");

/*
==============================
controllers for the jobs API.
==============================
*/

//********** create a job **********
const createJob = async (req, res) => {
  //associates the newly created job with the user who is making the request.( createdBy field is required in the schema).
  //! Note: req.user = { userId: payload.userId, name: payload.name }; has been set for every authenticated user for requests to path starting  with /api/v1/jobs ( come from authenticateUser middleware)
  req.body.createdBy = req.user.userId;
  /*  const job = await Job.create({...req.body,createdBy:req.user.userId});
   */

  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json(job);
};

//****** controller that retrieves all jobs created by the authenticated user  ******
const getAllJobs = async (req, res) => {
  //! we get  req.user object from the AuthenticateUser middleware

  // req.user comes from the the authentication of the user
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

//********** get a job by id **********
const getJob = async (req, res) => {
  const jobId = req.params.id;
  const { userId } = req.user;
  // find a document where both _id and createdBy match the specified values.
  const foundJob = await Job.findOne({ _id: jobId, createdBy: userId });

  console.log(foundJob);
  if (!foundJob) {
    throw new NotFoundError(`The job with the id ${jobId} does not exist.`);
  }

  res.status(StatusCodes.OK).json({ foundJob });
};

//********** delete a single job **********
const deleteJob = async (req, res) => {
  const jobId = req.params.id;
  const { userId } = req.user;

  // will delete at most 1 (höchstens 1)
  const job = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: userId
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId} found`);
  }
  res.status(StatusCodes.OK).send();
};

//********** update a single job **********
const updateJob = async (req, res) => {
  const jobId = req.params.id;
  const { userId } = req.user;
  const { company, position } = req.body;
  if (company === "" || position === "") {
    throw new BadRequestError("Company or position fields cannot be empty");
  }
  let job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId} found`);
  }
  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
};
