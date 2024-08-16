import os

def count_files_in_folders(path):
    for folder_name in os.listdir(path):
        folder_path = os.path.join(path, folder_name)
        if os.path.isdir(folder_path):
            file_count = len([name for name in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, name))])
            print(f"Folder '{folder_name}' contains {file_count} files.")

# Define the path
path = "./static/img"

# Call the function
count_files_in_folders(path)

# import os

# def rename_files_in_folders(path):
#     for folder_name in os.listdir(path):
#         folder_path = os.path.join(path, folder_name)
#         if os.path.isdir(folder_path):
#             files = sorted([f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))])
#             # Temporary renaming to avoid conflicts
#             for idx, file_name in enumerate(files, start=1):
#                 ext = os.path.splitext(file_name)[1]
#                 temp_name = f"temp_{idx}{ext}"
#                 old_path = os.path.join(folder_path, file_name)
#                 temp_path = os.path.join(folder_path, temp_name)
#                 os.rename(old_path, temp_path)
            
#             # Rename to final names
#             temp_files = sorted([f for f in os.listdir(folder_path) if f.startswith("temp_")])
#             for idx, temp_name in enumerate(temp_files, start=1):
#                 ext = os.path.splitext(temp_name)[1]
#                 final_name = f"{idx}{ext}"
#                 temp_path = os.path.join(folder_path, temp_name)
#                 final_path = os.path.join(folder_path, final_name)
#                 os.rename(temp_path, final_path)

#             print(f"Files in folder '{folder_name}' have been renamed.")

# # Define the path
# path = "./image"

# # Call the function
# rename_files_in_folders(path)