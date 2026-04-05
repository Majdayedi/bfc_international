import re

with open('c:/Users/User/Desktop/bfc-consulting-innovation/frontend/components/OurProjectsPage.tsx', 'r', encoding='utf-8') as f:
    page = f.read()

with open('projects_ts.txt', 'r', encoding='utf-8') as f:
    ts_array = f.read()

new_page = re.sub(r'const PROJECTS: Project\[\] = \[.+?\];', ts_array, page, flags=re.DOTALL)

with open('c:/Users/User/Desktop/bfc-consulting-innovation/frontend/components/OurProjectsPage.tsx', 'w', encoding='utf-8') as f:
    f.write(new_page)

print('File updated successfully.')
