export interface TelegramExport {
  name: string;
  type: "personal_chat";
  id: number;
  messages: TelegramMessage[];
}

// Messages

export type TelegramMessage =
  // Type service
  | TelegramMessageServicePhoneCall
  | TelegramMessageServicePhoneCallMissed
  | TelegramMessageServiceProximityReached
  | TelegramMessageServiceEditChatTheme
  | TelegramMessageServicePinMessage
  | TelegramMessageServiceSuggestProfilePhoto
  | TelegramMessageServiceJoinedTelegram
  | TelegramMessageServiceScoreInGame
  | TelegramMessageServiceTakeScreenshot
  // Type message
  | TelegramMessageText
  | TelegramMessageTextViaBot
  | TelegramMessageGame
  | TelegramMessageAsFile
  | TelegramMessageAnimatedStickerViaBot
  | TelegramMessageVideo
  | TelegramMessageVideoMessage
  | TelegramMessageAnimation
  | TelegramMessageBotPhoto
  | TelegramMessageExpiringPhoto
  | TelegramMessageVoiceMessage
  | TelegramMessageImageFile
  | TelegramMessageAsFileNoMimeType
  | TelegramMessageLocation
  | TelegramMessageLiveLocation
  | TelegramMessagePoll
  | TelegramMessageContact
  | TelegramMessageAnimatedSticker
  | TelegramMessageSticker;

export interface TextTypeCustomEmoji {
  document_id: string;
  text: string;
  type: "custom_emoji";
}

export interface TextTypeGeneric {
  text: string;
  type:
    | "link"
    | "mention"
    | "code"
    | "italic"
    | "bold"
    | "underline"
    | "strikethrough"
    | "spoiler"
    | "bank_card"
    | "hashtag"
    | "cashtag"
    | "email"
    | "phone";
}

export interface TextTypeBlockquote {
  text: string;
  type: "blockquote";
  collapsed: boolean;
}

export interface TextTypeTextLink {
  text: string;
  href: string;
  type: "text_link";
}

export interface TextTypeCode {
  language: string;
  text: string;
  type: "pre";
}

export interface TextTypeMentionName {
  text: string;
  type: "mention_name";
  user_id: number;
}

export type TextType =
  | TextTypeCustomEmoji
  | TextTypeGeneric
  | TextTypeCode
  | TextTypeMentionName
  | TextTypeBlockquote;

export interface TelegramMessageDate {
  /** Add ".000Z" to convert to Date */
  date: string;
  date_unixtime?: string;
}

export interface TelegramMessageEdited {
  /** Add ".000Z" to convert to Date */
  edited?: string;
  edited_unixtime?: string;
}

export interface TelegramMessageFrom {
  from: string;
  from_id: `user${number}` | number;
}

export interface TelegramMessagePoll extends TelegramMessageDate, TelegramMessageFrom {
  forwarded_from?: string | null;
  id: number;
  poll: {
    answers: {
      chosen: boolean;
      text: string;
      voters: number;
    }[];
    closed: boolean;
    question: string;
    total_voters: number;
  };
  text: "";
  text_entities?: [];
  type: "message";
}

export interface TelegramMessageLocation extends TelegramMessageDate, TelegramMessageFrom {
  id: number;
  location_information: {
    latitude: number;
    longitude: number;
  };
  address?: string;
  place_name?: string;
  text: "";
  text_entities?: [];
  reply_to_message_id?: number;
  type: "message";
  forwarded_from?: string | null;
}

export interface TelegramMessageLiveLocation extends TelegramMessageLocation, TelegramMessageEdited {
  live_location_period_seconds: number;
}

export interface TelegramMessageContact extends TelegramMessageDate, TelegramMessageFrom {
  id: number;
  text: "";
  text_entities?: [];
  type: "message";
  reply_to_message_id?: number;
  contact_vcard?: string;
  contact_information: {
    first_name: string;
    last_name: string;
    phone_number: string;
  };
  forwarded_from?: string | null;
}

export interface TelegramMessageText extends TelegramMessageDate, TelegramMessageEdited, TelegramMessageFrom {
  id: number;
  /** If it is empty, it is an emoji with a random output, like a dice. */
  text: string | (string | TextType)[];
  text_entities?: TelegramTextEntity[];
  reply_to_message_id?: number;
  /** The public name */
  forwarded_from?: string | null;
  type: "message";
}

export interface TelegramMessageGame extends TelegramMessageDate, TelegramMessageEdited, TelegramMessageFrom {
  game_description: string;
  game_link: string;
  game_title: string;
  id: number;
  text: string | (string | TextType)[];
  text_entities?: TelegramTextEntity[];
  type: "message";
  via_bot: string;
}

export interface TelegramMessageTextViaBot extends TelegramMessageText {
  via_bot: string;
}

export interface TelegramMessageSticker extends TelegramMessageText {
  file: string;
  height?: number;
  width?: number;
  media_type: "sticker";
  /** If it doesn't have this, it is a sticker sent as file */
  sticker_emoji?: string;
  text: "";
  text_entities?: [];
  thumbnail?: string;
  via_bot?: string;
}

export interface TelegramMessageAnimatedSticker extends TelegramMessageSticker {
  duration_seconds: number;
}

export interface TelegramMessageAsFile extends TelegramMessageDate, TelegramMessageEdited, TelegramMessageFrom {
  file: string;
  id: number;
  mime_type: `application/${"pdf" | "zip"}` | "video/mp4" | string;
  text: string | (string | TextType)[];
  text_entities?: TelegramTextEntity[];
  type: "message";
  thumbnail?: string;
  reply_to_message_id?: number;
  forwarded_from?: string | null;
}

export interface TelegramMessageAnimatedStickerViaBot
  extends Omit<TelegramMessageAsFile, "mime_type" | "thumbnail" | "text" | "text_entities"> {
  height: number;
  width: number;
  mime_type: "application/x-tgsticker";
  thumbnail: string;
  text: "";
  text_entities?: [];
  via_bot: string;
}

export type TelegramMessageAsFileNoMimeType = Omit<TelegramMessageAsFile, "mime_type">;

export interface TelegramMessageImageFile extends Omit<TelegramMessageAsFile, "mime_type" | "thumbnail"> {
  height: number;
  width: number;
  mime_type: "image/jpeg" | "image/png" | "image/heif" | "image/gif";
  thumbnail: string;
}

export interface TelegramMessageVideo extends Omit<TelegramMessageAsFile, "mime_type"> {
  duration_seconds: number;
  height: number;
  width: number;
  media_type: "video_file";
  mime_type: `video/${string}`;
  thumbnail: string;
}

export interface TelegramMessageVideoMessage extends Omit<TelegramMessageVideo, "thumbnail" | "media_type"> {
  media_type: "video_message";
  thumbnail?: string;
}

export interface TelegramMessageAnimation extends Omit<TelegramMessageVideo, "thumbnail" | "media_type"> {
  media_type: "animation";
  thumbnail?: string;
  via_bot?: string;
}

export interface TelegramMessageVoiceMessage extends Omit<TelegramMessageAsFile, "media_type" | "mime_type"> {
  duration_seconds: number;
  media_type: "voice_message";
  mime_type: "audio/ogg";
}

export interface TelegramMessageAudioFile extends Omit<TelegramMessageAsFile, "media_type" | "mime_type"> {
  media_type: "audio_file";
  mime_type: `audio/${string}`;
  duration_seconds: number;
  performer?: string; // not sure if this is optional
  title?: string; // not sure if this is optional
  thumbnail?: string;
}

export interface TelegramMessageBotPhoto extends TelegramMessageText {
  height: number;
  photo: string;
  width: number;
  via_bot: string;
}

export interface TelegramMessageExpiringPhoto extends TelegramMessageDate, TelegramMessageFrom {
  id: number;
  photo?: string;
  file?: string;
  self_destruct_period_seconds: number;
  text: string | (string | TextType)[];
  text_entities?: TelegramTextEntity[];
  type: "message";
}

export interface TelegramMessageServicePhoneCall extends TelegramMessageDate {
  action: "phone_call";
  /** The name of the user */
  actor: string;
  actor_id: `user${number}` | number;
  discard_reason: "hangup" | "disconnect";
  duration_seconds?: number;
  id: number;
  text: "";
  text_entities?: [];
  type: "service";
}

export interface TelegramMessageServicePhoneCallMissed
  extends Omit<TelegramMessageServicePhoneCall, "discard_reason" | "duration_seconds"> {
  discard_reason: "missed" | "busy";
}

export interface TelegramMessageServiceProximityReached extends TelegramMessageDate, TelegramMessageFrom {
  action: "proximity_reached";
  distance: number;
  id: number;
  text: "";
  text_entities?: [];
  to: string;
  to_id: `user${number}`;
  type: "service";
}

export interface TelegramMessageServiceEditChatTheme extends TelegramMessageDate {
  action: "edit_chat_theme";
  actor: string;
  actor_id: `user${number}` | number;
  emoticon?: string;
  id: number;
  text: "";
  text_entities?: [];
  type: "service";
}

export interface TelegramMessageServicePinMessage extends TelegramMessageDate {
  action: "pin_message";
  actor: string;
  actor_id: `user${number}` | number;
  id: number;
  message_id: number;
  text: "";
  text_entities?: [];
  type: "service";
}

export interface TelegramMessageServiceSuggestProfilePhoto extends TelegramMessageDate {
  action: "suggest_profile_photo";
  actor: string;
  actor_id: `user${number}` | number;
  height: number;
  width: number;
  id: number;
  photo: string;
  text: "";
  text_entities?: [];
  type: "service";
}

export interface TelegramMessageServiceJoinedTelegram extends TelegramMessageDate {
  action: "joined_telegram";
  actor: string;
  actor_id: `user${number}` | number;
  id: number;
  text: "";
  text_entities?: [];
  type: "service";
}

export interface TelegramMessageServiceScoreInGame extends TelegramMessageDate {
  action: "score_in_game";
  actor: string;
  actor_id: `user${number}` | number;
  game_message_id: number;
  id: number;
  score: number;
  text: "";
  text_entities?: [];
  type: "service";
}

export interface TelegramMessageServiceTakeScreenshot extends TelegramMessageDate {
  action: "take_screenshot";
  actor: string;
  actor_id: `user${number}` | number;
  id: number;
  text: "";
  text_entities?: [];
  type: "service";
}

// Text Entities

export interface TelegramTextEntity {}
