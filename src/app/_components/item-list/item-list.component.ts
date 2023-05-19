import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ItemService } from "../../_services/item.service";
import { Item } from "../../_models/item";
import { Message } from "../../_models/message";

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  message: Message | undefined;
  allItems: Item[] = [];
  items: Item[] = [];
  bsModalRef?: BsModalRef;
  model: any = {};
  modelId: number | undefined;
  modalErrors: any | undefined;
  search: string | undefined;
  messageError: string | undefined;

  constructor(private itemService: ItemService, private modalService: BsModalService) {
  }

  ngOnInit(): void {
    this.loadItems();
  }

  submitForm(id: number | undefined): void {
    if (id) this.updateItem();
    else this.createItem();
  }

  createItem(): void {
    this.itemService.createItem(this.model).subscribe({
      next: message => {
        this.closeModal();
        this.loadItems();
        this.message = message;
        this.closeAlertError();
        console.log(message);
      },
      error: error => {
        this.modalErrors = error.error.errors;
        console.log(error);
      }
    });
  }

  updateItem(): void {
    this.itemService.updateItem(this.model).subscribe({
      next: message => {
        this.closeModal();
        this.loadItems();
        this.message = message;
        this.closeAlertError();
        console.log(message);
      },
      error: error => {
        if (error.error.errors) {
          this.modalErrors = error.error.errors;
        } else {
          this.closeModal();
          this.loadItems();
          this.messageError = error.error.message;
        }
        console.log(error);
      }
    })
  }

  loadItems(): void {
    this.itemService.getItems().subscribe({
      next: items => {
        this.allItems = items;
        this.items = items;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  searchItems(): void {
    if (!this.search || this.search == "") {
      this.items = this.allItems;
      return;
    }

    const str = this.search.toLowerCase();

    this.items = this.allItems.filter(item =>
      -1 < item.id.toString().indexOf(str) ||
      -1 < item.code.indexOf(str) ||
      -1 < item.name.indexOf(str) ||
      -1 < item.description.indexOf(str)
    );
  }

  deleteItem(id: number): void {
    this.itemService.deleteItem(id).subscribe({
      next: message => {
        this.loadItems();
        this.message = message;
      },
      error: error => {
        this.closeAlert();
        this.loadItems();
        this.messageError = error.error.message;
        console.log(error)
      }
    });
  }

  openModal(template: TemplateRef<any>, id: number | undefined): void {
    this.bsModalRef = this.modalService.show(template);
    this.model = {};
    this.modelId = undefined;
    this.modalErrors = undefined;

    if (id) {
      this.model = {...this.items.find(x => x.id === id)};
      this.modelId = id;
    }
  }

  closeModal() {
    this.bsModalRef?.hide();
    this.model = {};
    this.modelId = undefined;
    this.modalErrors = undefined;
  }

  closeAlert() {
    this.message = undefined;
  }

  closeAlertError() {
    this.messageError = undefined;
  }
}
