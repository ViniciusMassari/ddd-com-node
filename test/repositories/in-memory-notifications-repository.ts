import type { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import type { Notification } from "@/domain/notification/enterprise/entities/notification";
export class InMemoryNotificationsRepository
	implements NotificationsRepository
{
	async findById(id: string): Promise<Notification | null> {
		const notification = this.items.find((item) => item.id.toValue() === id);
		if (!notification) return null;

		return notification;
	}
	async save(notification: Notification): Promise<void> {
		const itemsIndex = this.items.findIndex(
			(item) => item.id === notification.id,
		);
		this.items[itemsIndex] = notification;
	}
	public items: Notification[] = [];
	async create(notification: Notification): Promise<void> {
		this.items.push(notification);
	}
}
