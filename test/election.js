var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts){
    var electionInstance;
    it("initializes with two candidates", function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count){
            assert.equal(count, 2);
        });
    });
});
    it("it initializes candidates with correct values", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate){
            assert.equal(candidate[0], 1, "contains the correct ID");
            assert.equal(candidate[1], "Narendra Modi", "contains the correct Name");
            assert.equal(candidate[2], 0, "contains the correct vote counts");
            return electionInstance.candidates(2);
        }).then(function(candidate){
            assert.equal(candidate[0], 2, "contains the correct ID");
            assert.equal(candidate[1], "Amit shah", "contains the correct Name");
            assert.equal(candidate[2], 0, "contains the correct vote counts");
        });
    });

    it("it allowes voter to cast a vote", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId, {from: accounts[0]});
        }).then(function(receipt){
            return electionInstance.voters(accounts[0]);
        }).then(function(voted){
            assert(voted, "The voter was marked as voted");
            return electionInstance.candidates(candidateId);
        }).then(function (candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount,1,"Increment the candidate's vote count")
        })
    });

    it("Throws on exception for invalid candidates", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.vote(99,{from: accounts[1]});
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert') >= 0,"error message must contain revert");
            return electionInstance.candidates(1);
        }).then(function(candidate1){
            var voteCount = candidate1[2];
            assert.equal(voteCount,1, "Candidate 1 did not receive any votes");
            return electionInstance.candidates(2);
        }).then(function (candidate2) {
            var voteCount = candidate[2];
            assert.equal(voteCount,0,"Candidate 2 did not receive any vote");
        });
    });

    it("Throws on exception for Double voting", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 2;
            return electionInstance.vote(candidateId,{from: accounts[1]});
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert') >= 0,"error message must contain revert");
            return electionInstance.candidates(1);
        }).then(function(candidate1){
            var voteCount = candidate1[2];
            assert.equal(voteCount,1, "Candidate 1 did not receive any votes");
            return electionInstance.candidates(2);
        }).then(function (candidate2) {
            var voteCount = candidate[2];
            assert.equal(voteCount,0,"Candidate 2 did not receive any vote");
        });
    });