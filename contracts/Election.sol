pragma solidity ^0.5.0;

contract Election {
    //model candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }
    //store candidate
    //fatch candidate
    mapping(uint => Candidate) public candidates;
    // store accounts that has voted
    mapping(address => bool) public voters;

    //store candidate count
    uint public candidatesCount;
    // constructor
    constructor () public {
        addCandidate("Narendra Modi");
        addCandidate("Amit shah");
    }
    function addCandidate (string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote(uint _candidateId) public {
        // Reire that they haven't voted before
        require(!voters[msg.sender]);

        // Valid candidate
        require(_candidateId >0 && _candidateId <= candidatesCount );

        // record that voter has voted
        voters[msg.sender] = true;

        // update vote
        candidates[_candidateId].voteCount++;
    }
}