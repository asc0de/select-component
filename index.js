var DropdownMode = getDropdownModes();
var items = getUsers();
new VkDropdown({ element: document.getElementById("dropdown1"), items: items });
new VkDropdown({ element: document.getElementById("dropdown2"), placeholder: "Выберите друга", avatar: true, items: items });
new VkDropdown({
    element: document.getElementById("dropdown3"),
    placeholder: "Выберите друзей",
    avatar: true,
    mode: DropdownMode.MULTI_SELECT,
    items: items
});
new VkDropdown({
    element: document.getElementById("dropdown4"),
    placeholder: "Введите имя",
    avatar: true,
    filter: true,
    mode: DropdownMode.MULTI_SELECT,
    items: items
});
new VkDropdown({
    element: document.getElementById("dropdown5"),
    placeholder: "Введите имя",
    avatar: true,
    search: true,
    mode: DropdownMode.MULTI_SELECT,
    items: items
});
