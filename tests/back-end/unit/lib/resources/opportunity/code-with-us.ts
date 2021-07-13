// import assert from 'assert';

import { connectToDatabase } from "back-end/index";
import { createCWUOpportunity } from "back-end/lib/db";
import { CreateCWUOpportunityStatus, CWUOpportunityStatus } from "shared/lib/resources/opportunity/code-with-us";
import { SessionRecord } from "shared/lib/resources/session";
import { User } from "shared/lib/resources/user";
import { cleanupUsers, createOpSession, createOpUser } from "unit/helpers/user";
import { expect } from 'chai'
import { spy } from 'sinon'

const dbConnexion = connectToDatabase();
const opportunityTemplate = {
  acceptanceCriteria: '',
  assignmentDate: new Date(),
  attachments: [],
  completionDate: new Date(),
  description: '',
  evaluationCriteria: '',
  location: '',
  proposalDeadline: new Date(),
  remoteDesc: '',
  remoteOk: true,
  reward: 1,
  skills: [],
  startDate: new Date(),
  status: CWUOpportunityStatus.Draft as CreateCWUOpportunityStatus,
  submissionInfo: '',
  teaser: '',
  title: '',
}

describe('Resource Code-With-Us', () => {
  let opUser:User;
  let opSession: SessionRecord;

  before(async () => {
    await cleanupUsers() 
    opUser = await createOpUser()
    opSession = createOpSession(opUser)
  })

  after(async () => {
    await cleanupUsers()
  })
  describe('Changelog', () => {
    it('Logs opportunity creation', async () => {
      const logSpy = spy()
      const f = await createCWUOpportunity(dbConnexion, opportunityTemplate, opSession, logSpy)
      console.log({ f })
      expect(logSpy.calledOnce).to.be.true
    })
    it('Logs opportunity update')
    it('Logs opportunity deletion')
    it('Logs opportunity addenda')
  })
})