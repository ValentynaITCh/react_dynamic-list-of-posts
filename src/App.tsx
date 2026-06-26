import classNames from 'classnames';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';

import { PostsList } from './components/PostsList';
import { PostDetails } from './components/PostDetails';
import { UserSelector } from './components/UserSelector';
import { Loader } from './components/Loader';
import { useEffect, useState } from 'react';
import { User } from './types/User';
import { getUsers } from './api/users';
import { Post } from './types/Post';
import { getUsersPosts } from './api/userPosts';

export const App = () => {
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const loadUserPosts = (userId: number) => {
    setIsPostsLoading(true);
    setError(false);

    getUsersPosts(userId)
      .then(setPosts)
      .catch(() => setError(true))
      .finally(() => setIsPostsLoading(false));
  };

  useEffect(() => {
    setIsUsersLoading(true);

    getUsers()
      .then(setUsers)
      .finally(() => {
        setIsUsersLoading(false);
      });
  }, []);

  useEffect(() => {
    setSelectedPost(null);

    if (selectedUser) {
      loadUserPosts(selectedUser.id);
    } else {
      setPosts([]);
    }
  }, [selectedUser]);

  return (
    <main className="section">
      <div className="container">
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box is-success">
              <div className="block">
                <UserSelector
                  users={users}
                  value={selectedUser}
                  onChange={setSelectedUser}
                />
              </div>

              <div className="block" data-cy="MainContent">
                {!selectedUser && !isPostsLoading && (
                  <p data-cy="NoSelectedUser">No user selected</p>
                )}

                {selectedUser && isPostsLoading && isUsersLoading && <Loader />}

                {error && (
                  <div
                    className="notification is-danger"
                    data-cy="PostsLoadingError"
                  >
                    Something went wrong!
                  </div>
                )}

                {posts.length === 0 &&
                  selectedUser &&
                  !isPostsLoading &&
                  !error && (
                  <div
                    className="notification is-warning"
                    data-cy="NoPostsYet"
                  >
                      No posts yet{' '}
                  </div>
                )}

                {posts.length === 0 && selectedUser && !isPostsLoading && !error && (
                  <div className="notification is-warning" data-cy="NoPostsYet">
                    No posts yet
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            data-cy="Sidebar"
            className={classNames(
              'tile',
              'is-parent',
              'is-8-desktop',
              'Sidebar',
              {
                'Sidebar--open': selectedPost,
              },
            )}
          >
            <div className="tile is-child box is-success ">
              {selectedPost && <PostDetails post={selectedPost} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
