/*

  This hubot script sets the status away when the user says "away for (anything here)".
  When the user says back, it sets the status back.

  When the name of the away user is mentioned while away then the bot replies that the user is away with the reason.

*/

module.exports = function(robot) {
  var status, username, mentioned_name, reason;

  // method which sets the status as away
  robot.respond(/(away for (.*))|(away.*$)|(afk.?$)/i, function(msg) {
    //msg.reply("Okay");
    reason = msg.match[0].trim();
    status = { "last_status":"away", "reason": reason};
    username = msg.message.user.name;
    robot.brain.set(username, status);
    console.log("@ away Robot knows that this username " + username + " has this status : " + robot.brain.get(username).last_status + " and the reason is " + robot.brain.get(username).reason);
    msg.reply("Ok your status has been set as away.");
  });

  // method which sets the status as active
  robot.respond(/back(.*)/i, function(msg) {
    status["last_status"] = "active";
    username = msg.message.user.name;
    console.log("@ back Robot knows that this username " + username + " has this status : " + robot.brain.get(username).last_status + " and the reason is " + robot.brain.get(username).reason);
    robot.brain.remove(username);
    console.log("Deleted the key that user was away")
    msg.reply("Ok your status has been set to active now.");
  });

  // method that mentions status when other people refer to a "away" member
  robot.hear(/@([\w.]+)/i, function(msg) {
    mentioned_name = msg.match[1].trim();
    username = robot.brain.userForId(mentioned_name,{}).name;
    if (robot.brain.get(username) !== null) {
      console.log("@ mention Robot knows that this username " + username + " has this status : " + robot.brain.get(username).last_status + " and the reason is " + robot.brain.get(username).reason);
      if (String(robot.brain.get(username).last_status) ===  "away") {
      msg.reply("Hey @" + username + " is " + robot.brain.get(username).reason + ".");
      }
    }
  });
}
