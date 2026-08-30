export type RootStackParamList = {
  Unlock: undefined;
  Passcode: undefined;
  Main: undefined;
};

export type FeedStackParamList = {
  Feed: undefined;
  MatchDetail: { shiftId: string };
};

export type ScheduleStackParamList = {
  Schedule: undefined;
  ShiftCheckIn: { bookingId?: string } | undefined;
};

export type MessagesStackParamList = {
  MessagesList: undefined;
  Conversation: { conversationId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  GetVerified: undefined;
  Payments: undefined;
  Reviews: undefined;
  BrowseWorkers: undefined;
  WorkerDetail: { workerId: string };
};

export type MainTabParamList = {
  FeedTab: undefined;
  ScheduleTab: undefined;
  MessagesTab: undefined;
  ProfileTab: undefined;
};

export type RequestsStackParamList = {
  MyShifts: undefined;
  PostShift: undefined;
  Applicants: { shiftId: string };
};

export type BrowseStackParamList = {
  Browse: undefined;
  WorkerDetail: { workerId: string };
};

export type ParticipantProfileStackParamList = {
  ParticipantProfile: undefined;
};

export type ParticipantTabParamList = {
  RequestsTab: undefined;
  BrowseTab: undefined;
  ParticipantMessagesTab: undefined;
  ParticipantProfileTab: undefined;
};
