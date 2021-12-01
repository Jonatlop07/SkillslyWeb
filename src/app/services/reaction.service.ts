import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  QueryReactionsReactors,
  QueryReactionsResponse,
  ReactionPerType,
} from '../interfaces/presenter/query_reactions.presenter';
import { map } from 'rxjs/operators';
import { JwtService } from './jwt.service';

@Injectable({ providedIn: 'root' })
export class ReactionService {
  private readonly API_URL: string = environment.API_URL;
  reactions: ReactionPerType[] = [];
  reactionsChanged = new Subject<ReactionPerType[]>();

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService
  ) {}

  addReaction(type: string, postId: string) {
    return this.http
      .post(
        `${this.API_URL}/permanent-posts/${postId}/react`,
        {
          reaction_type: type,
        },
        this.jwtService.getHttpOptions()
      );
  }

  queryReactions(postId: string) {
    return this.http.get<QueryReactionsResponse>(
      `${this.API_URL}/permanent-posts/${postId}/reactions`,
      this.jwtService.getHttpOptions()
    ).pipe(map((data) => {
        return this.getReactors(data.reactions);
    }));
  }

  getReactors(reactions: ReactionPerType[]) {
    const reactors: QueryReactionsReactors = {
      likes: { reaction_count: 0, reactors: [] },
      interested: { reaction_count: 0, reactors: [] },
      fun: { reaction_count: 0, reactors: [] },
    };
    reactions.forEach((reaction) => {
      if (reaction.reaction_type === 'LIKE') {
        reactors.likes = {
          reaction_count: reaction.reaction_count,
          reactors: reaction.reactors,
        };
      } else if (reaction.reaction_type === 'INTERESTED') {
        reactors.interested = {
          reaction_count: reaction.reaction_count,
          reactors: reaction.reactors,
        };
      } else if (reaction.reaction_type === 'FUN') {
        reactors.fun = {
          reaction_count: reaction.reaction_count,
          reactors: reaction.reactors,
        };
      }
    });
    return reactors;
  }
}
