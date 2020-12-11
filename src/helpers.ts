import { Campaign, Option, User, Vote } from "../generated/schema";

export function getOrCreateCampaign(id: String): Campaign {
  let campaign = Campaign.load(id);
  if (campaign == null) {
    campaign = new Campaign(id);
  }
  return campaign as Campaign;
}

export function getOrCreateOption(id: String): Option {
  let option = Option.load(id);
  if (option == null) {
    option = new Option(id);
  }
  return option as Option;
}

export function getOrCreateUser(id: String, persist: Boolean = true): User {
  let user = User.load(id);
  if (user == null) {
    user = new User(id);

    if (persist) {
      user.save();
    }
  }
  return user as User;
}

export function getOrCreateVote(id: String): Vote {
  let vote = Vote.load(id);
  if (vote == null) {
    vote = new Vote(id);
  }
  return vote as Vote;
}

export function getCampaignType(type: i32): String {
  if (type == 0) {
    return "General";
  } else if (type == 1) {
    return "NetworkFee";
  } else if (type == 2) {
    return "FeeHandlerBRR";
  }
  return "";
}
