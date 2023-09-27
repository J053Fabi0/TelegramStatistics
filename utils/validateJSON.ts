import joi, { SchemaMap } from "joi";
import {
  TelegramExport,
  TelegramMessageAnimatedSticker,
  TelegramMessageAnimation,
  TelegramMessageAsFile,
  TelegramMessageAudioFile,
  TelegramMessageBotPhoto,
  TelegramMessageDate,
  TelegramMessageEdited,
  TelegramMessageEpiringPhoto,
  TelegramMessageImageFile,
  TelegramMessageLiveLocation,
  TelegramMessageLocation,
  TelegramMessageServiceEditChatTheme,
  TelegramMessageServicePhoneCall,
  TelegramMessageServicePhoneCallMissed,
  TelegramMessageServicePinMessage,
  TelegramMessageServiceProximityReached,
  TelegramMessageServiceSuggestProfilePhoto,
  TelegramMessageSticker,
  TelegramMessageText,
  TelegramMessageTextViaBot,
  TelegramMessageVideo,
  TelegramMessageVoiceMessage,
  TextTypeCode,
  TextTypeCustomEmoji,
  TextTypeGeneric,
  TextTypeTextLink,
} from "../types/telegramExport.type.ts";

const from = {
  from: joi.string().required(),
  from_id: joi.string().pattern(/^user/).required(),
};
const date: Required<SchemaMap<TelegramMessageDate>> = {
  date_unixtime: joi.string().required(),
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
const text_entities = joi.array().required();
const reply_to_message_id = joi.number();
const forwarded_from = joi.string();

function makeEditedAnd<TSchema>(schema: SchemaMap<TSchema>) {
  return joi.object({ ...schema }).and("edited", "edited_unixtime");
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
    "strikethrough",
    "spoiler",
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

const text = joi
  .alternatives()
  .try(
    joi.string().allow(""),
    joi
      .array()
      .min(1)
      .items(joi.string().allow(""), textTypeCustomEmoji, textTypeGeneric, textTypeTextLink, textTypeCode)
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
  via_bot: joi.string().pattern(/^@/),
};

const telegramMessageSticker: Required<SchemaMap<TelegramMessageSticker>> = {
  ...telegramMessageText,
  file: joi.string().required(),
  height: joi.number().required(),
  width: joi.number().required(),
  media_type: strings("sticker"),
  sticker_emoji: joi.string(),
  text: strings(""),
  text_entities: joi.array().length(0).required(),
  thumbnail: joi.string().required(),
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
  text_entities: joi.array().required(),
  thumbnail: joi.string(),
  forwarded_from,
  reply_to_message_id,
  type: strings("message"),
};

const telegramMessageImageFile: Required<SchemaMap<TelegramMessageImageFile>> = {
  ...(() => {
    const { thumbnail: _, ...a } = telegramMessageAsFile;
    return a;
  })(),
  thumbnail: joi.string(),
  mime_type: strings("image/jpeg", "image/png"),
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
  mime_type: strings("video/mp4"),
};

const telegramMessageAnimation: Required<SchemaMap<TelegramMessageAnimation>> = {
  ...(() => {
    const { thumbnail: _, ...a } = telegramMessageVideo;
    return a;
  })(),
  thumbnail: joi.string(),
  media_type: strings("animation"),
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
  via_bot: joi.string().pattern(/^@/),
  text,
};

const telegramMessageExpiringPhoto: Required<SchemaMap<TelegramMessageEpiringPhoto>> = {
  ...date,
  ...from,
  id,
  photo: joi.string().required(),
  self_destruct_period_seconds: joi.number().required(),
  text,
  text_entities: joi.array().required(),
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
  text: strings(""),
  text_entities: joi.array().length(0).required(),
  type: strings("message"),
};

const telegramMessageLiveLocation: Required<SchemaMap<TelegramMessageLiveLocation>> = {
  ...edited,
  ...telegramMessageLocation,
  live_location_period_seconds: joi.number().required(),
};

const commonService = {
  ...date,
  id,
  text: strings(""),
  text_entities: joi.array().length(0).required(),
  type: strings("service"),
};

const telegramMessageServicePhoneCall: Required<SchemaMap<TelegramMessageServicePhoneCall>> = {
  action: strings("phone_call"),
  actor: joi.string().required(),
  actor_id: from.from_id,
  discard_reason: strings("hangup"),
  duration_seconds: joi.number().required(),
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
  emoticon: joi.string().required(),
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
          makeEditedAnd(telegramMessageSticker),
          makeEditedAnd(telegramMessageAnimatedSticker),
          makeEditedAnd(telegramMessageAsFile),
          makeEditedAnd(telegramMessageImageFile),
          makeEditedAnd(telegramMessageVideo),
          makeEditedAnd(telegramMessageAnimation),
          makeEditedAnd(telegramMessageVoiceMessage),
          makeEditedAnd(telegramMessageAudioFile),
          makeEditedAnd(telegramMessageBotPhoto),
          makeEditedAnd(telegramMessageExpiringPhoto),
          makeEditedAnd(telegramMessageLocation),
          makeEditedAnd(telegramMessageLiveLocation),
          telegramMessageServicePhoneCall,
          telegramMessageServicePhoneCallMissed,
          telegramMessageServiceProximityReached,
          telegramMessageServiceEditChatTheme,
          telegramMessageServicePinMessage,
          telegramMessageServiceSuggestProfilePhoto
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
