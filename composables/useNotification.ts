// useNotification.ts
import { ref, h, render, TransitionGroup, onMounted } from 'vue';
import X from '@/components/icon/x.vue';

interface NotificationOptions {
  title: string;
  message: string | VNode | Component;
  duration?: number;
}

interface Notification extends NotificationOptions {
  id: number;
  isClosing: boolean;
}

const ANIMATION_DURATION = 300; // ms

export const useNotification = () => {
  const notifications = ref<Notification[]>([]);
  let notificationId = 0;
  let containerEl: HTMLElement | null = null;

  const removeNotification = (id: number) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.value[index].isClosing = true;
      setTimeout(() => {
        notifications.value = notifications.value.filter((n) => n.id !== id);
      }, ANIMATION_DURATION);
    }
  };

  const NotificationContainer = {
    setup() {
      return () =>
        h(
          TransitionGroup,
          {
            tag: 'div',
            style: {
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: '9999',
            },
            name: 'notification',
            css: true,
          },
          () =>
            notifications.value.map((notification, index) => {
              return h(
                'div',
                {
                  key: notification.id,
                  style: {
                    backgroundColor: 'white',
                    padding: '12px 24px',
                    marginBottom: '10px',
                    border: '1px solid black',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    minWidth: '300px',
                    position: 'relative',
                    // transform: `translateY(${index * 100}%)`,
                    transition: 'all 0.3s ease',
                    opacity: notification.isClosing ? 0 : 1,
                    animation: 'notification-in 0.3s ease-out',
                  },
                },
                [
                  h(
                    'button',
                    {
                      onClick: () => removeNotification(notification.id),
                      style: {
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      onMouseover: (e: MouseEvent) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          '#f1f1f1';
                      },
                      onMouseleave: (e: MouseEvent) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          'transparent';
                      },
                    },
                    [
                      h(X, {
                        size: 1.4,
                        style: {
                          color: '#666',
                        },
                      }),
                    ]
                  ),
                  h(
                    'div',
                    {
                      style: {
                        fontWeight: 'bold',
                        marginBottom: '4px',
                        paddingRight: '20px',
                      },
                    },
                    notification.title
                  ),
                  typeof notification.message === 'string'
                    ? notification.message
                    : h(notification.message),
                ]
              );
            })
        );
    },
  };

  // Initialize container and styles only on client-side
  onMounted(() => {
    // Create container element
    containerEl = document.createElement('div');
    document.body.appendChild(containerEl);

    // Add keyframe animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes notification-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      .notification-move {
        transition: all ${ANIMATION_DURATION}ms ease;
      }
      
      .notification-enter-active {
        animation: notification-in ${ANIMATION_DURATION}ms ease-out;
      }
      
      .notification-leave-active {
        animation: notification-in ${ANIMATION_DURATION}ms ease-in reverse;
      }
    `;
    document.head.appendChild(style);

    // Render notification container
    if (containerEl) {
      render(h(NotificationContainer), containerEl);
    }
  });

  const MyNotification = ({
    title,
    message,
    duration = 4000,
  }: NotificationOptions): void => {
    const id = notificationId++;

    const notification: Notification = {
      id,
      title,
      message,
      isClosing: false,
    };

    notifications.value.push(notification);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  return {
    MyNotification,
  };
};

// Type declaration for better IDE support
export type NotificationFunction = {
  (options: NotificationOptions): void;
};
