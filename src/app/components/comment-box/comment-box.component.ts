import { Component, Input, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-comment-box',
  imports: [FormsModule, CommonModule],
  templateUrl: './comment-box.component.html',
  styleUrl: './comment-box.component.css'
})
export class CommentBoxComponent implements OnInit {
  @Input() productId!: string;
  @Input() type!: 'album' | 'track' | 'merch';
  canComment  = false;
  comments: any[] = [];
  newComment = "";
  currentUserId: string | null = null;
  
  constructor(private commentsService: CommentsService, private ordersService: OrdersService, private auth: AuthService) {}
  
  ngOnInit(): void {
    this.currentUserId = this.auth.getUserId();
    this.loadComments();
    this.checkPermission();
  }

  checkPermission() {
    /*const userId = this.auth.getUserId();
    if(!userId) {
      this.canComment = false;
      return;
    }

    this.ordersService.hasPurchased(userId, this.productId, this.type)
    .subscribe({
      next: (purchase) => {
        console.log('hasPurchased result:', purchase);
        this.canComment = purchase;
      },
      error: () => {
        this.canComment = false;
      }
    });*/
    this.canComment = true;
  }

  loadComments() {
    let req;
    if(this.type === 'album') {
      req = this.commentsService.getAlbumComments(this.productId);
    }
    if(this.type === 'track') {
      req = this.commentsService.getTrackComments(this.productId);
    }
    if(this.type === 'merch') {
      req = this.commentsService.getArticleComments(this.productId);
    }

    req?.subscribe((r:any) => {
    this.comments = Array.isArray(r) ? r : r.data;
    this.comments.forEach(c => this.loadReplies(c.id));
    });
  }

  loadReplies(commentId: string) {
    this.commentsService.getCommentReplies(commentId).subscribe((r:any)=> {
      const comment = this.comments.find(c=> c.id === commentId);
      if(comment){
         comment.replies = (r.data || []).filter((reply:any) => reply && reply.id);
      }
    });
  }

  like(commentId: string) {
    this.commentsService.likeComment(commentId).subscribe(() =>{
      this.loadComments();
    })
  }

  toggleReply(comment: any) {
    comment.showReplyBox = !comment.showReplyBox;
    comment.replyText = '';
  }

  sendReply(commentId: string, replyText: string){
    if(!this.canComment || !replyText.trim()) return;

    this.commentsService.replyToComment(commentId, replyText).subscribe((created: any) => {
    const comment = this.comments.find(c => c.id === commentId);
    if (comment) {
      comment.replies = comment.replies || [];
      comment.replies.push(created);
      comment.replyText = '';
      comment.showReplies = true;
    }
    });
  }

  submit() {
    if (!this.newComment.trim()) return;

    let req;
    if (this.type === 'album') {
      req = this.commentsService.addAlbumComment(this.productId, this.newComment, 5);
    } else if (this.type === 'track') {
      req = this.commentsService.addTrackComment(this.productId, this.newComment, 5);
    } else {
      req = this.commentsService.addArticleComment(this.productId, this.newComment, 5);
    }

    req?.subscribe((created: any) => {
      this.newComment = '';
      this.comments.unshift(created.data); // ojo: backend devuelve { data: {...} }
      created.data.replies = [];
    });
  }


  delete(commentId: string) {
    this.commentsService.deleteComment(commentId).subscribe(() => {
      this.comments = this.comments.filter(c=> c.id !== commentId);
    })
  }

  deleteReply(commentId: string, replyId: string) {
    const comment = this.comments.find(c=> c.id === commentId);
    const reply = comment?.replies.find((r:any) => r.id === replyId);

    if(reply && reply.userId === this.currentUserId) {
      this.commentsService.deleteComment(replyId).subscribe(() => {
        comment.replies = comment.replies.filter((r:any) => r.id !== replyId);
      });
    }
  }

  toggleEdit(comment: any) {
    comment.editing = true;
    comment.editText = comment.text;
  }

  saveEdit(comment: any) {
    if(!comment.editText.trim()) return;

    this.commentsService.editComment(comment.id, comment.editText).subscribe(() => {
      comment.text = comment.editText;
      comment.editing = false;
    });
  }
}
