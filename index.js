var DropdownMode = getDropdownModes();
new VkDropdown(document.getElementById("dropdown1"));
new VkDropdown({ element: document.getElementById("dropdown2"), placeholder: "Выберите друга", avatar: true });
new VkDropdown({
    element: document.getElementById("dropdown3"),
    placeholder: "Выберите друзей",
    avatar: true,
    mode: DropdownMode.MULTI_SELECT
});
new VkDropdown({
    element: document.getElementById("dropdown4"),
    placeholder: "Введите имя",
    avatar: true,
    search: true,
    mode: DropdownMode.MULTI_SELECT
});
