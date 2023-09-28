import joi, { SchemaMap } from "joi";
import {
  TelegramExport,
  TelegramMessageAnimatedSticker,
  TelegramMessageAnimatedStickerViaBot,
  TelegramMessageAnimation,
  TelegramMessageAsFile,
  TelegramMessageAsFileNoMimeType,
  TelegramMessageAudioFile,
  TelegramMessageBotPhoto,
  TelegramMessageContact,
  TelegramMessageDate,
  TelegramMessageEdited,
  TelegramMessageExpiringPhoto,
  TelegramMessageGame,
  TelegramMessageImageFile,
  TelegramMessageLiveLocation,
  TelegramMessageLocation,
  TelegramMessagePoll,
  TelegramMessageServiceEditChatTheme,
  TelegramMessageServiceJoinedTelegram,
  TelegramMessageServicePhoneCall,
  TelegramMessageServicePhoneCallMissed,
  TelegramMessageServicePinMessage,
  TelegramMessageServiceProximityReached,
  TelegramMessageServiceScoreInGame,
  TelegramMessageServiceSuggestProfilePhoto,
  TelegramMessageServiceTakeScreenshot,
  TelegramMessageSticker,
  TelegramMessageText,
  TelegramMessageTextViaBot,
  TelegramMessageVideo,
  TelegramMessageVideoMessage,
  TelegramMessageVoiceMessage,
  TextTypeCode,
  TextTypeCustomEmoji,
  TextTypeGeneric,
  TextTypeMentionName,
  TextTypeTextLink,
} from "../types/telegramExport.type.ts";

const from = {
  from: joi.string().required(),
  from_id: joi.alternatives().try(joi.string().pattern(/^user/), joi.number()).required(),
};
const date: Required<SchemaMap<TelegramMessageDate>> = {
  date_unixtime: joi.string(),
  date: joi.string().required(),
};
const edited: Required<SchemaMap<TelegramMessageEdited>> = {
  edited_unixtime: joi.string(),
  edited: joi.string(),
};
const strings = (...t: string[]) =>
  joi
    .string()
    .valid(...t)
    .required();
const id = joi.number().required();
const text_entities = joi.array();
const reply_to_message_id = joi.number();
const forwarded_from = joi.alternatives().try(joi.string(), joi.valid(null));
const via_bot = joi.string().pattern(/^@/);

function makeEditedAnd<TSchema>(schema: SchemaMap<TSchema>) {
  // if edited_unixtime is present, edited must be present
  // but if edited is present, edited_unixtime is not required
  return joi
    .object({ ...schema })
    .when("edited_unixtime", {
      is: joi.exist(),
      then: joi.object({ ...schema, ...edited }),
      otherwise: joi.object({ ...schema }),
    })
    .required();
}

const textTypeCustomEmoji: Required<SchemaMap<TextTypeCustomEmoji>> = {
  document_id: joi.string().required(),
  text: joi.string().required(),
  type: strings("custom_emoji"),
};

const textTypeGeneric: Required<SchemaMap<TextTypeGeneric>> = {
  text: joi.string().required(),
  type: strings(
    "link",
    "mention",
    "code",
    "italic",
    "bold",
    "underline",
    "strikethrough",
    "spoiler",
    "bank_card",
    "hashtag",
    "cashtag",
    "email",
    "phone"
  ),
};

const textTypeTextLink: Required<SchemaMap<TextTypeTextLink>> = {
  text: joi.string().required(),
  href: joi.string().required(),
  type: strings("text_link"),
};

const textTypeCode: Required<SchemaMap<TextTypeCode>> = {
  text: joi.string().required(),
  language: joi.string().allow("").required(),
  type: strings("pre"),
};

const textTypeMentionName: Required<SchemaMap<TextTypeMentionName>> = {
  text: joi.string().required(),
  user_id: joi.number().required(),
  type: strings("mention_name"),
};

const text = joi
  .alternatives()
  .try(
    joi.string().allow(""),
    joi
      .array()
      .min(1)
      .items(
        joi.string().allow(""),
        textTypeCustomEmoji,
        textTypeGeneric,
        textTypeTextLink,
        textTypeCode,
        textTypeMentionName
      )
  )
  .required();

const telegramMessageText: Required<SchemaMap<TelegramMessageText>> = {
  ...date,
  ...from,
  ...edited,
  id,
  text,
  text_entities,
  reply_to_message_id,
  forwarded_from,
  type: strings("message"),
};

const telegramMessageTextViaBot: Required<SchemaMap<TelegramMessageTextViaBot>> = {
  ...telegramMessageText,
  via_bot: via_bot.required(),
};

const telegramMessageGame: Required<SchemaMap<TelegramMessageGame>> = {
  ...date,
  ...from,
  ...edited,
  game_description: joi.string().required(),
  game_link: joi.string().required(),
  game_title: joi.string().required(),
  id,
  text,
  text_entities,
  type: strings("message"),
  via_bot: via_bot.required(),
};

const telegramMessageSticker: Required<SchemaMap<TelegramMessageSticker>> = {
  ...telegramMessageText,
  file: joi.string().required(),
  height: joi.number(),
  width: joi.number(),
  media_type: strings("sticker"),
  sticker_emoji: joi.string(),
  text: strings(""),
  text_entities: joi.array().length(0),
  thumbnail: joi.string(),
  via_bot,
};

const telegramMessageAnimatedSticker: Required<SchemaMap<TelegramMessageAnimatedSticker>> = {
  ...telegramMessageSticker,
  duration_seconds: joi.number().required(),
};

const telegramMessageAsFile: Required<SchemaMap<TelegramMessageAsFile>> = {
  ...date,
  ...edited,
  file: joi.string().required(),
  ...from,
  id,
  mime_type: joi.string().required(),
  text,
  text_entities,
  thumbnail: joi.string(),
  forwarded_from,
  reply_to_message_id,
  type: strings("message"),
};

const telegramMessageAnimatedStickerViaBot: Required<SchemaMap<TelegramMessageAnimatedStickerViaBot>> = {
  ...telegramMessageAsFile,
  height: joi.number().required(),
  width: joi.number().required(),
  mime_type: strings("application/x-tgsticker"),
  thumbnail: joi.string().required(),
  via_bot,
  text: strings(""),
  text_entities: joi.array().length(0),
};

const telegramMessageAsFileNoMimeType: Required<SchemaMap<TelegramMessageAsFileNoMimeType>> = {
  ...(() => {
    const { mime_type: _, ...a } = telegramMessageAsFile;
    return a;
  })(),
};

const telegramMessageImageFile: Required<SchemaMap<TelegramMessageImageFile>> = {
  ...(() => {
    const { thumbnail: _, ...a } = telegramMessageAsFile;
    return a;
  })(),
  thumbnail: joi.string(),
  mime_type: strings("image/jpeg", "image/png", "image/heif", "image/gif"),
  height: joi.number().required(),
  width: joi.number().required(),
};

const telegramMessageVideo: Required<SchemaMap<TelegramMessageVideo>> = {
  ...telegramMessageAsFile,
  duration_seconds: joi.number().required(),
  height: joi.number().required(),
  width: joi.number().required(),
  media_type: strings("video_file"),
  thumbnail: joi.string().required(),
  mime_type: joi
    .string()
    .pattern(/^video\//)
    .required(),
};

const telegramMessageVideoMessage: Required<SchemaMap<TelegramMessageVideoMessage>> = {
  ...(() => {
    const { thumbnail: _, ...a } = telegramMessageVideo;
    return a;
  })(),
  thumbnail: joi.string(),
  media_type: strings("video_message"),
};

const telegramMessageAnimation: Required<SchemaMap<TelegramMessageAnimation>> = {
  ...(() => {
    const { thumbnail: _, ...a } = telegramMessageVideo;
    return a;
  })(),
  thumbnail: joi.string(),
  media_type: strings("animation"),
  via_bot,
};

const telegramMessageVoiceMessage: Required<SchemaMap<TelegramMessageVoiceMessage>> = {
  ...(() => {
    const { height: _, width: __, ...a } = telegramMessageAnimation;
    return a;
  })(),
  media_type: strings("voice_message"),
  mime_type: strings("audio/ogg"),
};

const telegramMessageAudioFile: Required<SchemaMap<TelegramMessageAudioFile>> = {
  ...(() => {
    const { height: _, width: __, ...a } = telegramMessageAnimation;
    return a;
  })(),
  media_type: strings("audio_file"),
  mime_type: joi
    .string()
    .pattern(/^audio\//)
    .required(),
  duration_seconds: joi.number().required(),
  performer: joi.string(),
  title: joi.string(),
  thumbnail: joi.string(),
};

const telegramMessageBotPhoto: Required<SchemaMap<TelegramMessageBotPhoto>> = {
  ...telegramMessageText,
  height: joi.number().required(),
  photo: joi.string().required(),
  width: joi.number().required(),
  via_bot,
  text,
};

const telegramMessageExpiringPhoto: Required<SchemaMap<TelegramMessageExpiringPhoto>> = {
  ...date,
  ...from,
  id,
  photo: joi.string(),
  file: joi.string(),
  self_destruct_period_seconds: joi.number().required(),
  text,
  text_entities,
  type: strings("message"),
};

const telegramMessageLocation: Required<SchemaMap<TelegramMessageLocation>> = {
  ...date,
  ...from,
  id,
  location_information: joi
    .object({
      latitude: joi.number().required(),
      longitude: joi.number().required(),
    })
    .required(),
  reply_to_message_id,
  forwarded_from,
  address: joi.string(),
  place_name: joi.string(),
  text: strings(""),
  text_entities: joi.array().length(0),
  type: strings("message"),
};

const telegramMessageLiveLocation: Required<SchemaMap<TelegramMessageLiveLocation>> = {
  ...edited,
  ...telegramMessageLocation,
  live_location_period_seconds: joi.number().required(),
};

const telegramMessagePoll: Required<SchemaMap<TelegramMessagePoll>> = {
  ...date,
  ...from,
  forwarded_from,
  id,
  poll: joi
    .object({
      answers: joi.array().items(
        joi.object({
          chosen: joi.boolean().required(),
          text: joi.string().required(),
          voters: joi.number().required(),
        })
      ),
      closed: joi.boolean().required(),
      question: joi.string().required(),
      total_voters: joi.number().required(),
    })
    .required(),
  text: strings(""),
  text_entities: joi.array().length(0),
  type: strings("message"),
};

const telegramMessageContact: Required<SchemaMap<TelegramMessageContact>> = {
  id: joi.number().required(),
  ...date,
  ...from,
  forwarded_from,
  text: strings(""),
  text_entities: joi.array().length(0),
  type: strings("message"),
  reply_to_message_id,
  contact_vcard: joi.string(),
  contact_information: joi
    .object({
      first_name: joi.string().allow("").required(),
      last_name: joi.string().allow("").required(),
      phone_number: joi.string().allow("").required(),
    })
    .required(),
};

const commonService = {
  ...date,
  id,
  text: strings(""),
  text_entities: joi.array().length(0),
  type: strings("service"),
};

const telegramMessageServicePhoneCall: Required<SchemaMap<TelegramMessageServicePhoneCall>> = {
  action: strings("phone_call"),
  actor: joi.string().required(),
  actor_id: from.from_id,
  discard_reason: strings("hangup", "disconnect"),
  duration_seconds: joi.number(),
  ...commonService,
};

const telegramMessageServicePhoneCallMissed: Required<SchemaMap<TelegramMessageServicePhoneCallMissed>> = {
  ...(() => {
    const { duration_seconds: _, ...a } = telegramMessageServicePhoneCall;
    return a;
  })(),
  discard_reason: strings("missed", "busy"),
};

const telegramMessageServiceProximityReached: Required<SchemaMap<TelegramMessageServiceProximityReached>> = {
  action: strings("proximity_reached"),
  distance: joi.number().required(),
  ...from,
  to: joi.string().required(),
  to_id: from.from_id,
  ...commonService,
};

const telegramMessageServiceEditChatTheme: Required<SchemaMap<TelegramMessageServiceEditChatTheme>> = {
  action: strings("edit_chat_theme"),
  actor: joi.string().required(),
  actor_id: from.from_id,
  emoticon: joi.string(),
  ...commonService,
};

const telegramMessageServicePinMessage: Required<SchemaMap<TelegramMessageServicePinMessage>> = {
  action: strings("pin_message"),
  actor: joi.string().required(),
  actor_id: from.from_id,
  message_id: joi.number().required(),
  ...commonService,
};

const telegramMessageServiceSuggestProfilePhoto: Required<SchemaMap<TelegramMessageServiceSuggestProfilePhoto>> = {
  action: strings("suggest_profile_photo"),
  actor: joi.string().required(),
  actor_id: from.from_id,
  height: joi.number().required(),
  width: joi.number().required(),
  photo: joi.string().required(),
  ...commonService,
};

const telegramMessageServiceJoinedTelegram: Required<SchemaMap<TelegramMessageServiceJoinedTelegram>> = {
  action: strings("joined_telegram"),
  actor: joi.string().required(),
  actor_id: from.from_id,
  ...commonService,
};

const telegramMessageServiceScoreInGame: Required<SchemaMap<TelegramMessageServiceScoreInGame>> = {
  action: strings("score_in_game"),
  actor: joi.string().required(),
  actor_id: from.from_id,
  game_message_id: joi.number().required(),
  score: joi.number().required(),
  ...commonService,
};

const telegramMessageServiceTakeScreenshot: Required<SchemaMap<TelegramMessageServiceTakeScreenshot>> = {
  action: strings("take_screenshot"),
  actor: joi.string().required(),
  actor_id: from.from_id,
  ...commonService,
};

const schema = joi.object<TelegramExport>({
  name: joi.string().required(),
  type: joi.string().valid("personal_chat").required(),
  id: joi.number().required(),
  messages: joi
    .array()
    .items(
      joi
        .alternatives()
        .try(
          makeEditedAnd(telegramMessageText),
          makeEditedAnd(telegramMessageTextViaBot),
          makeEditedAnd(telegramMessageGame),
          makeEditedAnd(telegramMessageSticker).and("height", "width"),
          makeEditedAnd(telegramMessageAnimatedSticker),
          makeEditedAnd(telegramMessageAsFile),
          telegramMessageAnimatedStickerViaBot,
          makeEditedAnd(telegramMessageImageFile),
          makeEditedAnd(telegramMessageAsFileNoMimeType),
          makeEditedAnd(telegramMessageVideo),
          makeEditedAnd(telegramMessageVideoMessage),
          makeEditedAnd(telegramMessageAnimation),
          makeEditedAnd(telegramMessageVoiceMessage),
          makeEditedAnd(telegramMessageAudioFile),
          makeEditedAnd(telegramMessageBotPhoto),
          makeEditedAnd(telegramMessageExpiringPhoto),
          makeEditedAnd(telegramMessageLocation),
          makeEditedAnd(telegramMessageLiveLocation),
          telegramMessagePoll,
          telegramMessageContact,
          telegramMessageServicePhoneCall,
          telegramMessageServicePhoneCallMissed,
          telegramMessageServiceProximityReached,
          telegramMessageServiceEditChatTheme,
          telegramMessageServicePinMessage,
          telegramMessageServiceSuggestProfilePhoto,
          telegramMessageServiceJoinedTelegram,
          telegramMessageServiceScoreInGame,
          telegramMessageServiceTakeScreenshot
        )
    ),
});

export default function validateJSON(json: TelegramExport) {
  return schema.validate(json, {
    convert: false,
    allowUnknown: false,
    abortEarly: true,
  });
}
