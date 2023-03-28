// import { CacheItem } from './cacheItem';

// class DoublyLinkedList {
//   head: CacheItem | null;
//   tail: CacheItem | null;
//   map: Map<string, CacheItem>;

//   constructor() {
//     this.head = null;
//     this.tail = null;
//     this.map = new Map<string, CacheItem>();
//   }

//   add(query: string, value: string) {
//     const node = new CacheItem(value);

//     if (this.head === null) {
//       this.head = node;
//       this.tail = node;
//     } else {
//       node.prev = this.tail;
//       this.tail!.next = node;
//       this.tail = node;
//     }

//     this.map.set(query, node);
//   }

//   remove(query: string) {
//     const node = this.map.get(query);

//     if (node === undefined) {
//       return;
//     }

//     if (node.prev !== null) {
//       node.prev.next = node.next;
//     } else {
//       this.head = node.next;
//     }

//     if (node.next !== null) {
//       node.next.prev = node.prev;
//     } else {
//       this.tail = node.prev;
//     }

//     this.map.delete(query);
//   }

//   get(query: string) {
//     const node = this.map.get(query);

//     if (node === undefined) {
//       return null;
//     }

//     return node.value;
//   }
// }

// export { DoublyLinkedList };
