const Voting = artifacts.require("./Voting.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('Voting', accounts => {
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    const voter4 = accounts[4];
    const voter5 = accounts[5];
    const voter6 = accounts[6];

    let VotingInstance;

    //On test d'abord les fonctions de changement de status car elles sont essentielles pour tester le reste du code
    //including tallyVotes
    describe("test workflow change functions...", function () {

        before(async function () {
            VotingInstance = await Voting.deployed({from: owner});
        });

        context('check onlyOwner', function() {
            it("should not change workflow to ProposalsRegistrationStarted if not the owner, revert", async () => {
                await expectRevert(VotingInstance.startProposalsRegistering({from: voter1}), 'Ownable: caller is not the owner');
            });

            it("should not change workflow to ProposalsRegistrationEnded if not the owner, revert", async () => {
                await expectRevert(VotingInstance.endProposalsRegistering({from: voter1}), 'Ownable: caller is not the owner');
            });

            it("should not change workflow to VotingSessionStarted if not the owner, revert", async () => {
                await expectRevert(VotingInstance.startVotingSession({from: voter1}), 'Ownable: caller is not the owner');
            });

            it("should not change workflow to VotingSessionEnded if not the owner, revert", async () => {
                await expectRevert(VotingInstance.endVotingSession({from: voter1}), 'Ownable: caller is not the owner');
            });

            it("should not change workflow to VotesTallied if not the owner, revert", async () => {
                await expectRevert(VotingInstance.tallyVotes({from: voter1}), 'Ownable: caller is not the owner');
            });
        });

        context('from RegisteringVoters WorkflowStatus', function () {
            it("should not change workflow to ProposalsRegistrationEnded, revert", async () => {
                await expectRevert(VotingInstance.endProposalsRegistering({ from: owner }), 'Registering proposals havent started yet');
            });

            it("should not change workflow to VotingSessionStarted, revert", async () => {
                await expectRevert(VotingInstance.startVotingSession({ from: owner }), 'Registering proposals phase is not finished');
            });

            it("should not change workflow to VotingSessionEnded, revert", async () => {
                await expectRevert(VotingInstance.endVotingSession({ from: owner }), 'Voting session havent started yet');
            });

            it("should not change workflow to VotesTallied, revert", async () => {
                await expectRevert(VotingInstance.tallyVotes({ from: owner }), 'Current status is not voting session ended');
            });

            it("should change workflow to ProposalsRegistrationStarted, get event WorkflowStatusChange", async () => {
                const findEvent = await VotingInstance.startProposalsRegistering({ from: owner });
                expectEvent(findEvent,"WorkflowStatusChange", {previousStatus: new BN(0), newStatus: new BN(1)});
            });
        });

        context('from ProposalsRegistrationStarted WorkflowStatus', function () {
            it("should not change workflow to ProposalsRegistrationStarted, revert", async () => {
                await expectRevert(VotingInstance.startProposalsRegistering({ from: owner }), 'Registering proposals cant be started now');
            });

            it("should not change workflow to VotingSessionStarted, revert", async () => {
                await expectRevert(VotingInstance.startVotingSession({ from: owner }), 'Registering proposals phase is not finished');
            });

            it("should not change workflow to VotingSessionEnded, revert", async () => {
                await expectRevert(VotingInstance.endVotingSession({ from: owner }), 'Voting session havent started yet');
            });

            it("should not change workflow to VotesTallied, revert", async () => {
                await expectRevert(VotingInstance.tallyVotes({ from: owner }), 'Current status is not voting session ended');
            });

            it("should change workflow to ProposalsRegistrationEnded, get event WorkflowStatusChange", async () => {
                const findEvent = await VotingInstance.endProposalsRegistering({ from: owner });
                expectEvent(findEvent,"WorkflowStatusChange", {previousStatus: new BN(1), newStatus: new BN(2)});
            });
        });

        context('from ProposalsRegistrationEnded WorkflowStatus', function () {
            it("should not change workflow to ProposalsRegistrationStarted, revert", async () => {
                await expectRevert(VotingInstance.startProposalsRegistering({ from: owner }), 'Registering proposals cant be started now');
            });

            it("should not change workflow to ProposalsRegistrationEnded, revert", async () => {
                await expectRevert(VotingInstance.endProposalsRegistering({ from: owner }), 'Registering proposals havent started yet');
            });

            it("should not change workflow to VotingSessionEnded, revert", async () => {
                await expectRevert(VotingInstance.endVotingSession({ from: owner }), 'Voting session havent started yet');
            });

            it("should not change workflow to VotesTallied, revert", async () => {
                await expectRevert(VotingInstance.tallyVotes({ from: owner }), 'Current status is not voting session ended');
            });

            it("should change workflow to VotingSessionStarted, get event WorkflowStatusChange", async () => {
                const findEvent = await VotingInstance.startVotingSession({ from: owner });
                expectEvent(findEvent,"WorkflowStatusChange", {previousStatus: new BN(2), newStatus: new BN(3)});
            });
        });

        context('from VotingSessionStarted WorkflowStatus', function () {
            it("should not change workflow to ProposalsRegistrationStarted, revert", async () => {
                await expectRevert(VotingInstance.startProposalsRegistering({ from: owner }), 'Registering proposals cant be started now');
            });

            it("should not change workflow to ProposalsRegistrationEnded, revert", async () => {
                await expectRevert(VotingInstance.endProposalsRegistering({ from: owner }), 'Registering proposals havent started yet');
            });

            it("should not change workflow to VotingSessionStarted, revert", async () => {
                await expectRevert(VotingInstance.startVotingSession({ from: owner }), 'Registering proposals phase is not finished');
            });

            it("should not change workflow to VotesTallied, revert", async () => {
                await expectRevert(VotingInstance.tallyVotes({ from: owner }), 'Current status is not voting session ended');
            });

            it("should change workflow to VotingSessionEnded, get event WorkflowStatusChange", async () => {
                const findEvent = await VotingInstance.endVotingSession({ from: owner });
                expectEvent(findEvent,"WorkflowStatusChange", {previousStatus: new BN(3), newStatus: new BN(4)});
            });
        });

        context('from VotingSessionEnded WorkflowStatus', function () {
            it("should not change workflow to ProposalsRegistrationStarted, revert", async () => {
                await expectRevert(VotingInstance.startProposalsRegistering({ from: owner }), 'Registering proposals cant be started now');
            });

            it("should not change workflow to ProposalsRegistrationEnded, revert", async () => {
                await expectRevert(VotingInstance.endProposalsRegistering({ from: owner }), 'Registering proposals havent started yet');
            });

            it("should not change workflow to VotingSessionStarted, revert", async () => {
                await expectRevert(VotingInstance.startVotingSession({ from: owner }), 'Registering proposals phase is not finished');
            });

            it("should not change workflow to VotingSessionEnded, revert", async () => {
                await expectRevert(VotingInstance.endVotingSession({ from: owner }), 'Voting session havent started yet');
            });

            it("should change workflow to VotesTallied, get event WorkflowStatusChange", async () => {
                const findEvent = await VotingInstance.tallyVotes({ from: owner });
                expectEvent(findEvent,"WorkflowStatusChange", {previousStatus: new BN(4), newStatus: new BN(5)});
            });
        });

        context('from VotesTallied WorkflowStatus', function () {
            it("should not change workflow to ProposalsRegistrationStarted, revert", async () => {
                await expectRevert(VotingInstance.startProposalsRegistering({ from: owner }), 'Registering proposals cant be started now');
            });

            it("should not change workflow to ProposalsRegistrationEnded, revert", async () => {
                await expectRevert(VotingInstance.endProposalsRegistering({ from: owner }), 'Registering proposals havent started yet');
            });

            it("should not change workflow to VotingSessionStarted, revert", async () => {
                await expectRevert(VotingInstance.startVotingSession({ from: owner }), 'Registering proposals phase is not finished');
            });

            it("should not change workflow to VotingSessionEnded, revert", async () => {
                await expectRevert(VotingInstance.endVotingSession({ from: owner }), 'Voting session havent started yet');
            });

            it("should not change workflow to VotesTallied, revert", async () => {
                await expectRevert(VotingInstance.tallyVotes({ from: owner }), 'Current status is not voting session ended');
            });
        });
    });

    describe("test addVoter and getVoter", function () {

        beforeEach(async function () {
            VotingInstance = await Voting.new({from: owner});
        });

        context('test on failure', function() {
            it("should not register if not the owner, revert", async () => {
                await expectRevert(VotingInstance.addVoter(voter1, {from: voter1}), 'Ownable: caller is not the owner');
            });

            it("should not getVoter from non registered voter, revert", async () => {
                // await VotingInstance.addVoter(voter1, {from: owner});
                await expectRevert(VotingInstance.getVoter(voter1, {from: voter2}), "You're not a voter");
            });

            it("should not register an already registered voter, revert", async () => {
                await VotingInstance.addVoter(voter1, { from: owner });
                await expectRevert(VotingInstance.addVoter(voter1, { from: owner }), 'Already registered');
            });
        });

        context('test on success', function() {
            it("should register a new voter, get isRegistered", async () => {
                await VotingInstance.addVoter(voter1, {from: owner});
                const storedData = await VotingInstance.getVoter(voter1, {from: voter1});
                await expect(storedData.isRegistered).to.be.true;
            });

            it("should register a new voter, get hasVoted", async () => {
                await VotingInstance.addVoter(voter1, {from: owner});
                const storedData = await VotingInstance.getVoter(voter1, {from: voter1});
                await expect(storedData.hasVoted).to.be.false;
            });

            it("should register a new voter, get votedProposalId", async () => {
                await VotingInstance.addVoter(voter1, {from: owner});
                const storedData = await VotingInstance.getVoter(voter1, {from: voter1});
                await expect(new BN(storedData.votedProposalId)).to.be.bignumber.equal(new BN(0));
            });

            it("should register a new voter, get event VoterRegistered", async () => {
                const findEvent = await VotingInstance.addVoter(voter1, {from: owner});
                expectEvent(findEvent,"VoterRegistered", {voterAddress: voter1});
            });

            it("should register 5 new voters, get isRegistered of third", async () => {
                await VotingInstance.addVoter(voter1, {from: owner});
                await VotingInstance.addVoter(voter2, {from: owner});
                await VotingInstance.addVoter(voter3, {from: owner});
                await VotingInstance.addVoter(voter4, {from: owner});
                await VotingInstance.addVoter(voter5, {from: owner});
                const storedData = await VotingInstance.getVoter(voter3, {from: voter1});
                await expect(storedData.isRegistered).to.be.true;
            });
        });
    });

    describe("test addProposal and getOneProposal", function () {

        beforeEach(async function () {
            VotingInstance = await Voting.new({from: owner});
            await VotingInstance.addVoter(voter1, {from: owner});
            await VotingInstance.addVoter(voter2, {from: owner});
            await VotingInstance.addVoter(voter3, {from: owner});
            await VotingInstance.startProposalsRegistering({from: owner});
        });

        context('test on failure', function() {
            it("should not add proposal if not registered voter, revert", async () => {
                await expectRevert(VotingInstance.addProposal("Proposal1", {from: voter4}), "You're not a voter");
            });

            it("should not add an empty proposal, revert", async () => {
                await expectRevert(VotingInstance.addProposal("", {from: voter1}), 'Vous ne pouvez pas ne rien proposer');
            });

            it("should not get proposal if not registered voter, revert", async () => {
                await expectRevert(VotingInstance.getOneProposal(0, {from: voter4}), "You're not a voter");
            });
        });

        context('test on success', function() {
            it("should add proposal, get description", async () => {
                await VotingInstance.addProposal("Proposal1", {from: voter1});
                const storedData = await VotingInstance.getOneProposal(0, {from: voter1});
                await expect(storedData.description).to.be.equal("Proposal1");
            });

            it("should add proposal, get voteCount", async () => {
                await VotingInstance.addProposal("Proposal1", {from: voter1});
                const storedData = await VotingInstance.getOneProposal(0, {from: voter1});
                await expect(new BN(storedData.voteCount)).to.be.bignumber.equal(new BN(0));
            });

            it("should add proposal, get event ProposalRegistered", async () => {
                const findevent = await VotingInstance.addProposal("Proposal1", {from: voter1});
                await expectEvent(findevent, "ProposalRegistered", {proposalId: new BN(0)});
            });

            it("should add 5 proposals, get description of third", async () => {
                await VotingInstance.addProposal("Proposal1", {from: voter1});
                await VotingInstance.addProposal("Proposal2", {from: voter2});
                await VotingInstance.addProposal("Proposal3", {from: voter3});
                await VotingInstance.addProposal("Proposal4", {from: voter1});
                await VotingInstance.addProposal("Proposal5", {from: voter2});
                const storedData = await VotingInstance.getOneProposal(2, {from: voter1});
                await expect(storedData.description).to.be.equal("Proposal3");
            });
        });
    });

    describe("test setVote", function () {

        beforeEach(async function () {
            VotingInstance = await Voting.new({from: owner});
            await VotingInstance.addVoter(voter1, {from: owner});
            await VotingInstance.addVoter(voter2, {from: owner});
            await VotingInstance.addVoter(voter3, {from: owner});
            await VotingInstance.addVoter(voter4, {from: owner});
            await VotingInstance.addVoter(voter5, {from: owner});
            await VotingInstance.startProposalsRegistering({from: owner});
            await VotingInstance.addProposal("Proposal1", {from: voter1});
            await VotingInstance.addProposal("Proposal2", {from: voter2});
            await VotingInstance.addProposal("Proposal3", {from: voter3});
            await VotingInstance.addProposal("Proposal4", {from: voter1});
            await VotingInstance.addProposal("Proposal5", {from: voter2});
            await VotingInstance.endProposalsRegistering({from: owner});
            await VotingInstance.startVotingSession({from: owner});
        });

        context('test on failure', function() {
            it("should not set vote if not registered voter, revert", async () => {
                await expectRevert(VotingInstance.setVote("0", {from: voter6}), "You're not a voter");
            });

            it("should not set vote if already voted, revert", async () => {
                await VotingInstance.setVote("0", {from: voter1});
                await expectRevert(VotingInstance.setVote("2", {from: voter1}), 'You have already voted');
            });

            it("should not set vote for a non existing proposal, revert", async () => {
                await expectRevert(VotingInstance.setVote(10, {from: voter1}), 'Proposal not found');
            });
        });

        context('test on success', function() {
            it("should set vote, get votedProposalId", async () => {
                await VotingInstance.setVote(1, {from: voter1});
                const storedData = await VotingInstance.getVoter(voter1, {from: voter1});
                await expect(new BN(storedData.votedProposalId)).to.be.bignumber.equal(new BN(1));
            });

            it("should set vote, get hasVoted", async () => {
                await VotingInstance.setVote(1, {from: voter1});
                const storedData = await VotingInstance.getVoter(voter1, {from: voter1});
                await expect(storedData.hasVoted).to.be.true;
            });

            it("should set vote, get voteCount", async () => {
                await VotingInstance.setVote(1, {from: voter1});
                const storedData = await VotingInstance.getOneProposal(1, {from: voter1});
                await expect(new BN(storedData.voteCount)).to.be.bignumber.equal(new BN(1));
            });

            it("should set vote, get event Voted", async () => {
                const findevent = await VotingInstance.setVote(1, {from: voter1});
                await expectEvent(findevent, "Voted", {voter: voter1, proposalId: new BN(1)});
            });

            it("should set 5 votes, get voteCount of third proposal", async () => {
                await VotingInstance.setVote(0, {from: voter1});
                await VotingInstance.setVote(1, {from: voter2});
                await VotingInstance.setVote(2, {from: voter3});
                await VotingInstance.setVote(2, {from: voter4});
                await VotingInstance.setVote(4, {from: voter5});
                const storedData = await VotingInstance.getOneProposal(2, {from: voter1});
                await expect(new BN(storedData.voteCount)).to.be.bignumber.equal(new BN(2));
            });
        });
    });

    describe("test tallyVotes and get winningProposalID", function () {
        beforeEach(async function () {
            VotingInstance = await Voting.new({from: owner});
            await VotingInstance.addVoter(voter1, {from: owner});
            await VotingInstance.addVoter(voter2, {from: owner});
            await VotingInstance.addVoter(voter3, {from: owner});
            await VotingInstance.addVoter(voter4, {from: owner});
            await VotingInstance.addVoter(voter5, {from: owner});
            await VotingInstance.startProposalsRegistering({from: owner});
            await VotingInstance.addProposal("Proposal1", {from: voter1});
            await VotingInstance.addProposal("Proposal2", {from: voter2});
            await VotingInstance.addProposal("Proposal3", {from: voter3});
            await VotingInstance.addProposal("Proposal4", {from: voter1});
            await VotingInstance.addProposal("Proposal5", {from: voter2});
            await VotingInstance.endProposalsRegistering({from: owner});
            await VotingInstance.startVotingSession({from: owner});
            await VotingInstance.setVote(0, {from: voter1});
            await VotingInstance.setVote(1, {from: voter2});
            await VotingInstance.setVote(2, {from: voter3});
            await VotingInstance.setVote(2, {from: voter4});
            await VotingInstance.setVote(4, {from: voter5});
            await VotingInstance.endVotingSession({from: owner});
        });

        context('test on failure', function() {
            it("should not tally votes if not the owner, revert", async () => {
                await expectRevert(VotingInstance.tallyVotes({from: voter1}), 'Ownable: caller is not the owner');
            });
        });

        context('test on success', function() {
            it("should tally votes, get winningProposalID", async () => {
                await VotingInstance.tallyVotes({from: owner});
                const storedData  = await VotingInstance.winningProposalID({from: owner});
                await expect(new BN(storedData)).to.be.bignumber.equal(new BN(2));
            });
        });
    });

    describe("test functions depending on workflows...", function () {

        before(async function () {
            // VotingInstance = await Voting.deployed({from: owner});
            VotingInstance = await Voting.new({from: owner});

        });

        context('from RegisteringVoters WorkflowStatus', function () {
            it("should register 5 voters", async () => {
                await VotingInstance.addVoter(voter1, {from: owner});
                await VotingInstance.addVoter(voter2, {from: owner});
                await VotingInstance.addVoter(voter3, {from: owner});
                await VotingInstance.addVoter(voter4, {from: owner});
                await VotingInstance.addVoter(voter5, {from: owner});
            });

            it("should not add proposal, revert", async () => {
                await expectRevert(VotingInstance.addProposal("Proposal1", {from: voter1}), 'Proposals are not allowed yet');
            });

            it("should not set vote, revert", async () => {
                await expectRevert(VotingInstance.setVote("0", {from: voter1}), 'Voting session havent started yet');
            });

            it("should not tally votes, revert", async () => {
                await expectRevert(VotingInstance.tallyVotes({from: owner}), "Current status is not voting session ended");
            });
            
            it("should change workflow to ProposalsRegistrationStarted, get event WorkflowStatusChange", async () => {
                const findEvent = await VotingInstance.startProposalsRegistering({ from: owner });
                expectEvent(findEvent,"WorkflowStatusChange", {previousStatus: new BN(0), newStatus: new BN(1)});
            });;
        });

        context('from ProposalsRegistrationStarted WorkflowStatus', function () {

            it("should not register voter, revert", async () => {
                await expectRevert(VotingInstance.addVoter(voter1, {from: owner}), 'Voters registration is not open yet');
            });

            it("should add 5 proposals", async () => {
                await VotingInstance.addProposal("Proposal1", {from: voter1});
                await VotingInstance.addProposal("Proposal2", {from: voter2});
                await VotingInstance.addProposal("Proposal3", {from: voter3});
                await VotingInstance.addProposal("Proposal4", {from: voter1});
                await VotingInstance.addProposal("Proposal5", {from: voter2});
            });

            it("should not set vote, revert", async () => {
                await expectRevert(VotingInstance.setVote("0", {from: voter1}), 'Voting session havent started yet');
            });

            it("should not tally votes, revert", async () => {
                await expectRevert(VotingInstance.tallyVotes({from: owner}), "Current status is not voting session ended");
            });
            
            it("should change workflow to ProposalsRegistrationEnded, get event WorkflowStatusChange", async () => {
                const findEvent = await VotingInstance.endProposalsRegistering({ from: owner });
                expectEvent(findEvent,"WorkflowStatusChange", {previousStatus: new BN(1), newStatus: new BN(2)});
            });
        });

        context('from ProposalsRegistrationEnded WorkflowStatus', function () {
            
            it("should not register voter, revert", async () => {
                await expectRevert(VotingInstance.addVoter(voter1, {from: owner}), 'Voters registration is not open yet');
            });

            it("should not add proposal, revert", async () => {
                await expectRevert(VotingInstance.addProposal("Proposal1", {from: voter1}), 'Proposals are not allowed yet');
            });

            it("should not set vote, revert", async () => {
                await expectRevert(VotingInstance.setVote("0", {from: voter1}), 'Voting session havent started yet');
            });

            it("should not tally votes, revert", async () => {
                await expectRevert(VotingInstance.tallyVotes({from: owner}), "Current status is not voting session ended");
            });
            
            it("should change workflow to VotingSessionStarted, get event WorkflowStatusChange", async () => {
                const findEvent = await VotingInstance.startVotingSession({ from: owner });
                expectEvent(findEvent,"WorkflowStatusChange", {previousStatus: new BN(2), newStatus: new BN(3)});
            });
        });

        context('from VotingSessionStarted WorkflowStatus', function () {
            it("should not register voter, revert", async () => {
                await expectRevert(VotingInstance.addVoter(voter1, {from: owner}), 'Voters registration is not open yet');
            });

            it("should not add proposal, revert", async () => {
                await expectRevert(VotingInstance.addProposal("Proposal1", {from: voter1}), 'Proposals are not allowed yet');
            });

            it("should set 5 votes, revert", async () => {
                await VotingInstance.setVote(0, {from: voter1});
                await VotingInstance.setVote(1, {from: voter2});
                await VotingInstance.setVote(2, {from: voter3});
                await VotingInstance.setVote(2, {from: voter4});
                await VotingInstance.setVote(4, {from: voter5});
            });

            it("should not tally votes, revert", async () => {
                await expectRevert(VotingInstance.tallyVotes({from: owner}), "Current status is not voting session ended");
            });
            
            it("should change workflow to VotingSessionEnded, get event WorkflowStatusChange", async () => {
                const findEvent = await VotingInstance.endVotingSession({ from: owner });
                expectEvent(findEvent,"WorkflowStatusChange", {previousStatus: new BN(3), newStatus: new BN(4)});
            });
        });

        context('from VotingSessionEnded WorkflowStatus', function () {
            it("should not register voter, revert", async () => {
                await expectRevert(VotingInstance.addVoter(voter1, {from: owner}), 'Voters registration is not open yet');
            });

            it("should not add proposal, revert", async () => {
                await expectRevert(VotingInstance.addProposal("Proposal1", {from: voter1}), 'Proposals are not allowed yet');
            });

            it("should not set vote, revert", async () => {
                await expectRevert(VotingInstance.setVote("0", {from: voter1}), 'Voting session havent started yet');
            });
            
            it("should tally votes and change workflow to VotesTallied, get event WorkflowStatusChange", async () => {
                const findEvent =  await VotingInstance.tallyVotes({from: owner});
                expectEvent(findEvent,"WorkflowStatusChange", {previousStatus: new BN(4), newStatus: new BN(5)});
            });
        });

        context('from VotesTallied WorkflowStatus', function () {
            it("should not register voter, revert", async () => {
                await expectRevert(VotingInstance.addVoter(voter1, {from: owner}), 'Voters registration is not open yet');
            });

            it("should not add proposal, revert", async () => {
                await expectRevert(VotingInstance.addProposal("Proposal1", {from: voter1}), 'Proposals are not allowed yet');
            });

            it("should not set vote, revert", async () => {
                await expectRevert(VotingInstance.setVote("0", {from: voter1}), 'Voting session havent started yet');
            });

            it("should not tally votes, revert", async () => {
                await expectRevert(VotingInstance.tallyVotes({from: owner}), "Current status is not voting session ended");
            });
        });
    });
});