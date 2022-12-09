# ML Research Project Template

This template is designed to help you with your research projects. In addition to the basic python code you would see in a generic project, I have also added development and production sections, including app development and web development.

In a more generic sense, a ML Research Project goes through 3 real components (shown in the form of a repository structure):

- [**`research`**](./research), wherein students perform exploratory data analyses, cleaning, model prototyping and simple experimentation and exploration. This is very likely done in the context of a notebook (eg Jupyter Notebook). This formally represents the data science lifecycle up till the data exploration section (i.e. acquisition, cleaning and exploration of data).

- [**`production`**](./production), where researchers use the prototyped models and fully train them. Since such models require a lot of usage of RAM etc, this is often done with the help of GPUs. Hence, distilled utils lib, training job and inference service are implemented here. The production-ready solution(s) are composed of libraries, services, and jobs.

- [**`development`**](./development), where researchers often utilise software development strategies in a truly ML4SE-like system to visualise and utilise their results. Applications on the web, desktop or mobile are often preferred, and this repository contains many templates for such development. Often, Streamlit is also used as a substitute to simply model information rather than creating a full-fledged application. Due to the complexity of these submodules, I have chosen to leave them as an exercise to the reader.

It is recommended to simply clone this repo and customize it to the specific use-case at hand. Delete appropriate directories please!
