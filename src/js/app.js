App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },
  
  initWeb3: function() {
    //TODO: refactor conditional
    if(typeof web3 !== 'undefined'){
      //If a web3 instance is already provided by meta mask
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election){
      // Instantiate a new truffle conracts from artifacts
      App.contracts.Election = TruffleContract(election);
      // connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);
      return App.render();
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    //load account data
    web3.eth.getCoinbase(function(err,account){
      if(err == null){
        App.account = account;
        $("#accountAddress").html("Your Account: "+ account);
      }
    });
      //Load account data
      App.contracts.Election.deployed().then(function(instance){
        electionInstance = instance;
        return electionInstance.candidatesCount();
      }).then(function(candidatesCount){
        var candidatesResults = $("#candidatesResults");
        candidatesResults.empty();

        var candidatesSelect = $("#candidatesSelect");
        candidatesSelect.empty();

        for(var i = 1; i<= candidatesCount; i++){
          electionInstance.candidates(i).then(function(candidate){
            var id = candidate[0];
            var name = candidate[1];
            var voteCount = candidate[2];
            //render Candidate Result
            var candidatetemplate = "<tr><td>" + id  + "</td><td>" +name + "</td><td>" +voteCount + "</td><tr>"
            candidatesResults.append(candidatetemplate);

            //Render candidate ballot option
            var candidateOption = "<option value='" + id  + "'>" +name + "</option>"
            candidatesSelect.append(candidateOption);

            // console.log(candidate[1]);
          });
        }
        return electionInstance.voters(App.account);
      }).then(function(hasVoted) {
          if(hasVoted){
            $('form').hide();
          }
        loader.hide();
        content.show();
      }).catch(function(error){
        console.warn(error);
      });
    },

    castVote: function() {
      var candidateId = $('#candidatesSelect').val();
      App.contracts.Election.deployed().then(function(instance){
        return instance.vote(candidateId, {from: App.account});
      }).then(function(result){
        // Wait for votes to update
        $("#content").hide();
        $("#loader").show();
      }).catch(function(){
        console.error(err);
      })
    }
};
//   markAdopted: function() {
//     /*
//      * Replace me...
//      */
//   },

//   handleAdopt: function(event) {
//     event.preventDefault();

//     var petId = parseInt($(event.target).data('id'));

//     /*
//      * Replace me...
//      */
//   }

// };

$(function() {
  $(window).load(function() {
    App.init();
  });
});
