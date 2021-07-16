// import assert from 'assert';

import { connectToDatabase } from "back-end/index";
import { addCWUOpportunityAddendum, awardCWUProposal, createCWUOpportunity, createCWUProposal, CreateCWUProposalParams, deleteCWUOpportunity, deleteCWUProposal, updateCWUOpportunityVersion, updateCWUProposal, UpdateCWUProposalParams, updateCWUProposalStatus } from "back-end/lib/db";
import { CreateCWUOpportunityStatus, CWUOpportunity, CWUOpportunityStatus } from "shared/lib/resources/opportunity/code-with-us";
import { SessionRecord } from "shared/lib/resources/session";
import { cleanupDatabase, createOpUser, createUserSession, createVendorUser } from "unit/helpers/user";
import { expect } from 'chai'
import { SinonStub, stub } from 'sinon'
import { CreateIndividualProponentRequestBody, CWUProposal, CWUProposalStatus } from "shared/lib/resources/proposal/code-with-us";
import { ADT } from "shared/lib/types";
import Logger from "back-end/lib/logger";

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

const resetLogStub:Function = () => {
  const stub = Logger.logObjectChange as SinonStub
  stub.reset()
}

describe('Resource Code-With-Us', () => {
  let opSession: SessionRecord;
  let vendorSession: SessionRecord;

  before(async () => {
    await cleanupDatabase() 
    const opUser = await createOpUser()
    const vendorUser = await createVendorUser()
    opSession = createUserSession(opUser)
    vendorSession = createUserSession(vendorUser)
  })

  after(async () => {
    await cleanupDatabase()
  })

  describe('administration', () => {
    describe('Changelog', () => {
      let createOpportunity:Function;
      before(() => {
        createOpportunity = async () => {
          const newOpportunity = await createCWUOpportunity(dbConnexion, opportunityTemplate, opSession)
          resetLogStub();
          return newOpportunity.value as CWUOpportunity;
        }
      })

      beforeEach(async () => {
        stub(Logger, 'logObjectChange')
      })

      afterEach(() => {
        (Logger.logObjectChange as SinonStub).restore()
      })

      it('Logs opportunity creation', async () => {
        await createCWUOpportunity(dbConnexion, opportunityTemplate, opSession)
        expect((Logger.logObjectChange as SinonStub).calledOnce).to.be.true
        expect((Logger.logObjectChange as SinonStub).firstCall.args[1]).to.equal('CWU created')
      })
      it('Logs opportunity update', async () => {
        const {status, ...opportunityUpdate} = opportunityTemplate;
        const newOpportunity = await createOpportunity()
        await updateCWUOpportunityVersion(dbConnexion, {...opportunityUpdate, id: newOpportunity.id}, opSession)
        expect((Logger.logObjectChange as SinonStub).calledOnce).to.be.true
        expect((Logger.logObjectChange as SinonStub).firstCall.args[1]).to.equal('CWU updated')
      })
      it('Logs opportunity deletion', async () => {
        const newOpportunity = await createOpportunity()
        await deleteCWUOpportunity(dbConnexion, newOpportunity.id as string, opSession)
        expect((Logger.logObjectChange as SinonStub).calledOnce).to.be.true
        expect((Logger.logObjectChange as SinonStub).firstCall.args[1]).to.equal('CWU deleted')
      })
      it('Logs opportunity addenda', async () => {
        const newOpportunity = await createOpportunity()
        await addCWUOpportunityAddendum(dbConnexion, newOpportunity.id as string, 'My Addendum', opSession)
        expect((Logger.logObjectChange as SinonStub).calledOnce).to.be.true
        expect((Logger.logObjectChange as SinonStub).firstCall.args[1]).to.equal('CWU addendum added')
      })
    })
  })

  describe('proposals', () => {
    describe('Changelog', () => {
      const proponent: CreateIndividualProponentRequestBody = {
        city: 'HomeCity',
        country: 'HomeCountry',
        email: 'me@home.com',
        legalName: 'foo',
        mailCode:'ABC123',
        phone: '18888888888',
        region: 'HomeRegion',
        street1: '1 street road',
        street2: '',
      }
      let proposal:CreateCWUProposalParams
      let createProposal:Function
  
      beforeEach(async () => {
        stub(Logger, 'logObjectChange')
        const newOpportunity = await createCWUOpportunity(dbConnexion, opportunityTemplate, opSession)
        proposal = {
          additionalComments: '',
          attachments: [],
          opportunity: newOpportunity.value?.id as string,
          proponent: { tag: 'individual', value: proponent} as ADT<"individual", CreateIndividualProponentRequestBody>,
          proposalText: '',
          status: CWUProposalStatus.Draft,
        }
        resetLogStub();
  
        createProposal = async () => {
          const { value: newProposal} = await createCWUProposal(dbConnexion, proposal, vendorSession)
          resetLogStub();
          const { opportunity, ...proposalValues } = newProposal as CWUProposal;
          return proposalValues;
        }
      })
  
      afterEach(() => {
        (Logger.logObjectChange as SinonStub).restore()
      })
      it('Logs proposal creation', async () => {
        await createCWUProposal(dbConnexion, proposal, vendorSession)
        expect((Logger.logObjectChange as SinonStub).calledOnce).to.be.true
        expect((Logger.logObjectChange as SinonStub).firstCall.args[1]).to.equal('CWU proposal created')
      })

      it('Logs proposal update', async () => {
        const proposal = await createProposal()
        await updateCWUProposal(dbConnexion, {...proposal, createdBy: vendorSession.user.id} as UpdateCWUProposalParams, vendorSession)
        expect((Logger.logObjectChange as SinonStub).calledOnce).to.be.true
        expect((Logger.logObjectChange as SinonStub).firstCall.args[1]).to.equal('CWU proposal updated')
      })

      it('Logs proposal status update', async () => {
        const proposal = await createProposal()
        await updateCWUProposalStatus(dbConnexion, proposal.id, CWUProposalStatus.Submitted, 'Lorem ipsum', vendorSession)
        expect((Logger.logObjectChange as SinonStub).calledOnce).to.be.true
        expect((Logger.logObjectChange as SinonStub).firstCall.args[1]).to.equal('CWU proposal status updated')
      })

      it('Logs proposal award', async () => {
        const proposal = await createProposal()
        await awardCWUProposal(dbConnexion, proposal.id, 'Lorem ipsum', vendorSession)
        expect((Logger.logObjectChange as SinonStub).calledTwice).to.be.true
        expect((Logger.logObjectChange as SinonStub).firstCall.args[1]).to.equal('CWU published')
        expect((Logger.logObjectChange as SinonStub).secondCall.args[1]).to.equal('CWU proposal awarded')
      })

      it('Logs proposal deletion', async () => {
        const proposal = await createProposal()
        await deleteCWUProposal(dbConnexion, proposal.id, vendorSession)
        expect((Logger.logObjectChange as SinonStub).calledOnce).to.be.true
        expect((Logger.logObjectChange as SinonStub).firstCall.args[1]).to.equal('CWU proposal deleted')
      })
    })
  })
})