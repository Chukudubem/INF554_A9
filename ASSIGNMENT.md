# INF 554 Assignment 9

## Description

- Using D3 and the countries of assignment 1 (one year & 10 countries), build a proportional symbol map and a choropleth map.
- Using D3 and data of your choice from the [County of Los Angeles Open Data website](https://data.lacounty.gov/browse?limitTo=maps&utf8=%E2%9C%93), show the data on a map of the *Los Angeles County*. You can choose the map type.

All maps should be imported as GeoJSON or TopoJSON. Data can be imported in GeoJSON, TopoJSON, or a delimiter-separated format (e.g. csv, tsv). The page should be properly formatted and the maps should be documented, including labels, legend, and title as appropriate to the map type.

## Rubric

### Development and published site (5 pts)

Demonstrate good development practices:

- Document set-up & deployment in [README.md](README.md)
- Use incremental commits that are meaningful e.g. each commit adds one feature/component/bugfix.
- Test that your code works before you commit.
- Do not commit files that are not related to/needed for the assignment.
- Using npm is a good development practice and is strongly encouraged, but not required.
- Using Bootstrap and Angular is also a good development practice and is strongly encouraged, but not required.
- All files needed to deploy the site should be stored in the repository. However, installable node packages should **not** be stored in the repository.

Publish your work on your USC SCF account at:

```url
http://www-scf.usc.edu/~<username>/a9/
```

Add a link to the **published URL** in [README.md](README.md). Describe the data and cite your sources in the webpage.

| Quality       | Points | Description |
| ------------- | ------ | ----------- |
| Sophisticated | 4-5    | Use of GIT is demonstrated. Set-up and deployment are documented. Page is well formatted with a proper layout and explanatory text. |
| Competent     | 2-3    | Use of GIT is not well demonstrated. Set-up and deployment are not well documented. Page is not well formatted and or not using proper layout and or no explanatory text is provided. |
| Needs work    | 0-1    | Use of GIT is not demonstrated. Set-up and deployment are not documented. Page is not formatted, not using proper layout, no explanatory text is provided. |

### Proportional Symbol Map (5 pts)

| Quality       | Points | Description |
| ------------- | ------ | ----------- |
| Sophisticated | 4-5    | Map is well formatted, using appropriate projection, uses D3 data join, data is well formatted, imported using an appropriate format, labels, title and legend are well formatted, using scales appropriately and well documented. |
| Competent     | 2-3    | Map is not well formatted, projection not appropriate, D3 data join not used well, data is not well formatted, or not imported using an appropriate format, labels, title and legend are not well formatted, use of scales inappropriate, not appropriate and not well documented. |
| Needs work    | 0-1    | Map is not formatted, projection inappropriate, D3 data join not used, data is not formatted, not imported using an appropriate format, labels, title and legend are not formatted, use of scales is not appropriate and not documented. |

### Choropleth Map (5 pts)

Same rubric as the Proportional Symbol Map.

### Los Angeles County Map (5 pts)

Same rubric as the Proportional Symbol Map.

## Homework Guidelines

- Homework repository must be updated before the start of next class
- Commits after the submission deadline will not be considered unless requested
- Late policy: 10% of total available points per each 24-hour late; duration less than 24 hours counts as one whole 24-hour
- Homework is expected to work in: Safari AND Chrome (Mac), Edge AND Chrome (Windows), Firefox AND Chrome (Linux)

## Important Note from Graders

Homework will sometime be assessed on Linux systems which use case-sensitive filesystem by default. Ensure that you use the same case when referring to files in web pages. For example, if an image tag refers to `myFile.png` but the actual filename is `myfile.png`, the image will not appear on the web page in Linux systems. We will deduct points if this happens. Use [Visual Studio Code HTML path completion feature](https://code.visualstudio.com/updates/v1_21#_html-path-completion) and/or double-check filenames to avoid this problem.

