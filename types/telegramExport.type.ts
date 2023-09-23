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
  // Type message
  | TelegramMessageText
  | TelegramMessageTextViaBot
  | TelegramMessageAsFile
  | TelegramMessageVideo
  | TelegramMessageAnimation
  | TelegramMessageBotPhoto
  | TelegramMessageEpiringPhoto
  | TelegramMessageVoiceMessage
  | TelegramMessageImageFile
  | TelegramMessageLocation
  | TelegramMessageLiveLocation
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
    | "strikethrough"
    | "spoiler"
    | "hashtag"
    | "email"
    | "phone";
}

export interface TextTypeTextLink {
  text: string;
  href: string;
  type: "text_link";
}

export type TextType = TextTypeCustomEmoji | TextTypeGeneric;

export interface TelegramMessageDate {
  /** Add ".000Z" to convert to Date */
  date: string;
  date_unixtime: string;
}

export interface TelegramMessageEdited {
  /** Add ".000Z" to convert to Date */
  edited: string;
  edited_unixtime: string;
}

export interface TelegramMessageFrom {
  from: string;
  from_id: `user${number}`;
}

export interface TelegramMessageLocation extends TelegramMessageDate, TelegramMessageFrom {
  id: number;
  location_information: {
    latitude: number;
    longitude: number;
  };
  text: "";
  text_entities: [];
  type: "message";
}

export interface TelegramMessageLiveLocation extends TelegramMessageLocation, TelegramMessageEdited {
  live_location_period_seconds: number;
}

export interface TelegramMessageText extends TelegramMessageDate, TelegramMessageEdited, TelegramMessageFrom {
  id: number;
  /** If it is empty, it is an emoji with a random output, like a dice. */
  text: string | (string | TextType)[];
  text_entities: TelegramTextEntity[];
  reply_to_message_id?: number;
  /** The public name */
  forwarded_from?: string;
  type: "message";
}

export interface TelegramMessageTextViaBot extends TelegramMessageText {
  via_bot: string;
}

export interface TelegramMessageSticker extends TelegramMessageText {
  file: string;
  height: number;
  width: number;
  media_type: "sticker";
  /** If it doesn't have this, it is a sticker sent as file */
  sticker_emoji?: string;
  text: "";
  text_entities: [];
  thumbnail: string;
}

export interface TelegramMessageAnimatedSticker extends TelegramMessageSticker {
  duration_seconds: number;
}

export interface TelegramMessageAsFile extends TelegramMessageDate, TelegramMessageEdited, TelegramMessageFrom {
  file: string;
  id: number;
  mime_type: `application/${"pdf" | "zip"}` | "video/mp4";
  text: string | (string | TextType)[];
  text_entities: TelegramTextEntity[];
  type: "message";
  thumbnail?: string;
  reply_to_message_id?: number;
  forwarded_from?: string;
}

export interface TelegramMessageImageFile extends Omit<TelegramMessageAsFile, "mime_type" | "thumbnail"> {
  height: number;
  width: number;
  mime_type: "image/jpeg" | "image/png";
  thumbnail: string;
}

export interface TelegramMessageVideo extends Omit<TelegramMessageAsFile, "mime_type"> {
  duration_seconds: number;
  height: number;
  width: number;
  media_type: "video_file";
  mime_type: "video/mp4";
  thumbnail: string;
}

export interface TelegramMessageAnimation extends Omit<TelegramMessageVideo, "thumbnail" | "media_type"> {
  media_type: "animation";
  thumbnail?: string;
}

export interface TelegramMessageVoiceMessage extends Omit<TelegramMessageAsFile, "media_type" | "mime_type"> {
  duration_seconds: number;
  media_type: "voice_message";
  mime_type: "audio/ogg";
}

export interface TelegramMessageBotPhoto extends TelegramMessageText {
  height: number;
  photo: string;
  width: number;
  via_bot: string;
}

export interface TelegramMessageEpiringPhoto extends TelegramMessageDate, TelegramMessageFrom {
  id: number;
  photo: string;
  self_destruct_period_seconds: number;
  text: string | (string | TextType)[];
  text_entities: TelegramTextEntity[];
  type: "message";
}

export interface TelegramMessageServicePhoneCall extends TelegramMessageDate {
  action: "phone_call";
  /** The name of the user */
  actor: string;
  actor_id: `user${number}`;
  discard_reason: "hangup";
  duration_seconds: number;
  id: number;
  text: "";
  text_entities: [];
  type: "service";
}

export interface TelegramMessageServicePhoneCallMissed
  extends Omit<TelegramMessageServicePhoneCall, "discard_reason" | "duration_seconds"> {
  discard_reason: "missed";
}

export interface TelegramMessageServiceProximityReached extends TelegramMessageDate, TelegramMessageFrom {
  action: "proximity_reached";
  distance: number;
  id: number;
  text: "";
  text_entities: [];
  to: string;
  to_id: `user${number}`;
  type: "service";
}

export interface TelegramMessageServiceEditChatTheme extends TelegramMessageDate {
  action: "edit_chat_theme";
  actor: string;
  actor_id: `user${number}`;
  emoticon: string;
  id: number;
  text: "";
  text_entities: [];
  type: "service";
}

export interface TelegramMessageServicePinMessage extends TelegramMessageDate {
  action: "pin_message";
  actor: string;
  actor_id: `user${number}`;
  id: number;
  message_id: number;
  text: "";
  text_entities: [];
  type: "service";
}

export interface TelegramMessageServiceSuggestProfilePhoto extends TelegramMessageDate {
  action: "suggest_profile_photo";
  actor: string;
  actor_id: `user${number}`;
  height: number;
  width: number;
  id: number;
  photo: string;
  text: "";
  text_entities: [];
  type: "service";
}

// Text Entities

export interface TelegramTextEntity {}
