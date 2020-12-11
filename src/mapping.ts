import { BigInt } from "@graphprotocol/graph-ts";
import {
  CancelledCampaign,
  NewCampaignCreated,
  Voted
} from "../generated/KyberDao/KyberDao";
import {
  getOrCreateUser,
  getOrCreateVote,
  getOrCreateCampaign,
  getOrCreateOption,
  getCampaignType
} from "./helpers";
import { Campaign } from "../generated/schema";

export function handleNewCampaignCreated(event: NewCampaignCreated): void {
  let campaign = getOrCreateCampaign(event.params.campaignID.toString());
  campaign.type = getCampaignType(event.params.campaignType);
  campaign.startTimestamp = event.params.startTimestamp;
  campaign.endTimestam = event.params.endTimestam;
  campaign.minPercentageInPrecision = event.params.minPercentageInPrecision;
  campaign.cInPrecision = event.params.cInPrecision;
  campaign.tInPrecision = event.params.tInPrecision;
  campaign.isCancelled = false;

  campaign.save();

  let options = event.params.options;
  for (let i = 0; i < options.length; i++) {
    let currentId = event.params.campaignID
      .toString()
      .concat("-")
      .concat(BigInt.fromI32(i).toString());
    let option = getOrCreateOption(currentId);
    option.voteCount = BigInt.fromI32(0);
    option.save();
  }
}

export function handleCancelledCampaign(event: CancelledCampaign): void {
  let campaign = Campaign.load(event.params.campaignID.toString());
  if (campaign != null) {
    campaign.isCancelled = true;
    campaign.save();
  } else {
    log.warning("Campaign doesn't exist, yet it was cancelled. ID {}", [
      event.params.campaignID.toString()
    ]);
  }
}

export function handleVoted(event: Voted): void {
  let eventId = event.transaction.hash
    .toHexString()
    .concat("-")
    .concat(event.logIndex.toString());
  let user = getOrCreateUser(event.params.staker.toHexString());
  let vote = getOrCreateVote(eventId);

  vote.voter = user.id;
  vote.option = event.params.campaignID
    .toString()
    .concat("-")
    .concat(event.params.option.toString());
  vote.epoch = event.params.epoch;

  vote.save();
}
