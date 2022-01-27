export interface Reactor{
  email: string;
  name: string;
}

export interface ReactionPerType{
  reaction_type?: string;
  reaction_count: number;
  reactors: Reactor[];
}

export interface QueryReactionsResponse{
  reactions: ReactionPerType[]
}

export interface QueryReactionsReactors{
  likes: ReactionPerType;
  interested: ReactionPerType;
  fun: ReactionPerType;
}