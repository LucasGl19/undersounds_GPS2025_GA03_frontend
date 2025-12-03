import { Component, Input, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  rating = 0;
  currentUserId: string | null = null;
  userCache: Map<string, { name: string, avatarUrl: string | null }> = new Map();
  
  constructor(
    private commentsService: CommentsService, 
    private ordersService: OrdersService, 
    private auth: AuthService,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    this.currentUserId = this.auth.getUserId();
    this.loadComments();
    this.checkPermission();
  }

  checkPermission() {
    const userId = this.auth.getUserId();
    if(!userId) {
      this.canComment = false;
      return;
    }
    if (this.type === 'track') {
      this.canComment = true;
      return;
    }
    this.ordersService.hasPurchased(userId, this.productId, this.type)
    .subscribe({
      next: (purchase) => {
        this.canComment = purchase;
      },
      error: () => {
        this.canComment = false;
      }
    });
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
      this.loadUserNames();
      this.comments.forEach(c => this.loadReplies(c.id));
    });
  }

  loadUserNames() {
    const uniqueUserIds = [...new Set(this.comments.map(c => c.userId).filter(id => id))];
    const userIdsToFetch = uniqueUserIds.filter(id => !this.userCache.has(String(id)));

    if (userIdsToFetch.length === 0) {
      this.attachUserNames();
      return;
    }

    // Cargar usuarios uno por uno con catchError para manejar errores individuales
    const requests = userIdsToFetch.map(userId => 
      this.userService.getUserById(userId).pipe(
        catchError(err => {
          console.error(`Error cargando usuario ${userId}:`, err);
          return of(null); // Retornar null en caso de error
        })
      )
    );

    forkJoin(requests).subscribe({
      next: (users: any[]) => {
        users.forEach((user, index) => {
          const userId = String(userIdsToFetch[index]);
          if (user) {
            const displayName = user.name || user.username || 'Usuario';
            this.userCache.set(userId, {
              name: displayName,
              avatarUrl: user.avatarUrl
            });
          }
        });
        this.attachUserNames();
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.attachUserNames();
      }
    });
  }

  attachUserNames() {
    this.comments.forEach(comment => {
      const userInfo = this.userCache.get(String(comment.userId));
      if (userInfo) {
        comment.userName = userInfo.name;
        comment.userAvatar = userInfo.avatarUrl;
      } else {
        comment.userName = 'Usuario';
        comment.userAvatar = null;
      }
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


  submit() {
    if (!this.newComment.trim()) return;

    let req;
    if (this.type === 'album') {
      req = this.commentsService.addAlbumComment(this.productId, this.newComment, this.rating, this.currentUserId!);
    } else if (this.type === 'track') {
      req = this.commentsService.addTrackComment(this.productId, this.newComment, this.rating);
    } else {
      req = this.commentsService.addArticleComment(this.productId, this.newComment, this.rating, this.currentUserId!);
    }

    req?.subscribe((created: any) => {
      this.newComment = '';
      this.rating = 0;
      const newCommentData = created.data;
      newCommentData.replies = [];
      
      // Agregar información del usuario actual
      const currentUserInfo = this.userCache.get(this.currentUserId!);
      if (currentUserInfo) {
        newCommentData.userName = currentUserInfo.name;
        newCommentData.userAvatar = currentUserInfo.avatarUrl;
        this.comments.unshift(newCommentData);
      } else {
        // Cargar información del usuario actual si no está en cache
        this.comments.unshift(newCommentData);
        this.userService.getUserById(this.currentUserId!).subscribe((user: any) => {
          if (user) {
            const displayName = user.name || user.username || 'Usuario';
            newCommentData.userName = displayName;
            newCommentData.userAvatar = user.avatarUrl;
            this.userCache.set(this.currentUserId!, {
              name: displayName,
              avatarUrl: user.avatarUrl
            });
          }
        });
      }
    });
  }


  delete(commentId: string) {
    this.commentsService.deleteComment(commentId).subscribe(() => {
      this.comments = this.comments.filter(c=> c.id !== commentId);
    })
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

  onAvatarError(event: any, userName: string) {
    // Fallback a avatar generado con iniciales
    const name = userName || 'U';
    event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`;
  }

  getAvatarUrl(userAvatar: string | null | undefined, userName: string | null | undefined): string {
    if (userAvatar && userAvatar.trim()) {
      return userAvatar;
    }
    const name = (userName && userName.trim()) || 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=128`;
  }
}
