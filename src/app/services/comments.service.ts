import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private http = inject(HttpClient);
  private api = environment.contentApiUrl;

  constructor() { }

  getAlbumComments(albumId: string) {
    return this.http.get(`${this.api}/albums/${albumId}/comments`);
  }

  addAlbumComment(albumId: string, text: string, rating: number =5, userId: string) {
    return this.http.post(`${this.api}/albums/${albumId}/comments`, {
      targetType: 'album',
      targetId: albumId,
      text,   
      rating,
      userId
    });
  }

  getTrackComments(trackId: string) {
    return this.http.get(`${this.api}/tracks/${trackId}/comments`);
  }
  
  addTrackComment(trackId: string, text: string, rating: number =5) {
    return this.http.post(`${this.api}/tracks/${trackId}/comments`, {
      targetType: 'track',
      targetId: trackId,
      text,
      rating});
  }

  getArticleComments(articleId: string) {
    return this.http.get(`${this.api}/merch/${articleId}/comments`);
  }

  addArticleComment(articleId: string, text: string, rating: number =5, userId: string) {
    return this.http.post(`${this.api}/merch/${articleId}/comments`,{
      targetType: 'merch',
      targetId: articleId,
      text,
      rating,
      userId
    });
  }

  likeComment(commentId: string) {
    return this.http.post(`${this.api}/comments/${commentId}/like`, {});
  }

  removeLikeComment(commentId: string) {
    return this.http.delete(`${this.api}/comments/${commentId}/like`);
  }

  getCommentReplies(commentId: string) {
    return this.http.get(`${this.api}/comments/${commentId}/replies`);
  }

  replyToComment(commentId: string, text:string) {
    return this.http.post(`${this.api}/comments/${commentId}/replies`, {text});
  }

  deleteComment(commentId: string) {
    return this.http.delete(`${this.api}/comments/${commentId}`)
  }

  editComment(commentId: string, body: string) {
    return this.http.patch(`${this.api}/comments/${commentId}`, {body});
  }
}
