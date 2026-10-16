# Byte Agent — Ask Questions. Understand Your Data.

**Byte Agent** is a data analysis agent that lets you explore datasets using natural-language questions. Instead of manually writing pandas queries or going through rows and columns yourself, you can upload a dataset and ask questions to understand its structure, identify patterns, compare groups, and investigate unusual values.

The idea behind the project is simple: an AI agent should do more than generate text. It should select the right analytical operation, run it against the actual data, and use the results to answer the user's question.

## Live Demo

**Try Byte Agent here:** https://byte-agent-ebon.vercel.app/

## What it does

- Accepts CSV and Excel datasets for analysis.
- Uses natural-language questions to determine the type of analysis needed.
- Runs dedicated data-analysis tools instead of relying only on generic model responses.
- Returns results based on the uploaded dataset.
- Helps users explore data without needing to write code for every question.

## The tools behind Byte Agent

Each tool handles a different analytical task. Together, they allow the agent to investigate a dataset from multiple angles.

### 1. Dataset Profiling
Provides an overview of the dataset, including its dimensions, column names, data types, and missing values. This is useful for understanding the data before performing deeper analysis.

### 2. Descriptive Statistics
Calculates statistical summaries such as mean, median, standard deviation, minimum, and maximum for suitable numerical columns. It helps identify typical values and the spread of the data.

### 3. Group-By Analysis
Groups records by a selected categorical column and calculates relevant aggregations for each group. This makes it possible to compare categories, departments, products, or other segments.

### 4. Correlation Analysis
Examines relationships between numerical variables using correlation coefficients. It can help identify variables that move together, although correlation alone does not establish causation.

### 5. Outlier Detection
Uses the interquartile range (IQR) method to flag numerical values that fall outside the expected range. This can help identify unusual observations that may deserve further investigation.

### 6. Monthly Time-Series Analysis
Analyzes data over monthly intervals when a suitable date column and relevant measures are available. It helps reveal changes and trends over time.

### 7. Group Comparison
Compares numerical measures across selected groups using appropriate summary statistics. This is useful when a question asks which category performs better or how two segments differ.

## How it works

1. Upload a supported dataset.
2. Ask a question in natural language.
3. The agent identifies the relevant analysis and selects a suitable tool.
4. The tool performs calculations on the uploaded data.
5. The agent uses the computed results to formulate an answer.

The goal is to keep the reasoning connected to actual data rather than returning an answer that merely sounds plausible.

## Tech Stack

- **Python** — core analysis logic
- **Pandas** — data manipulation and aggregation
- **NumPy** — numerical computations
- **Flask** — application backend
- **Vercel** — deployment

## Example questions

Depending on the columns available in your dataset, you can ask questions such as:

- Give me an overview of this dataset.
- Which columns contain missing values?
- What are the descriptive statistics for the numerical columns?
- Which categories have the highest average values?
- Are any numerical values potential outliers?
- How has a metric changed month by month?
- How do different groups compare?

The available answers depend on the uploaded dataset and the information it contains.

## Working with different datasets

Byte Agent is intended to work with different CSV and Excel files rather than depend on a single predefined example. The available analyses are selected according to the dataset's columns and data types.

For best results, use files with clear column names and suitable numerical, categorical, or date fields for the questions you want to ask.

## Project Goal

I built Byte Agent to explore how tool use can make AI-assisted data analysis more useful and reliable. The focus is on combining natural-language interaction with real analytical operations, so that answers can be traced back to calculations performed on the data.

## Future Improvements

- Add more specialized analysis tools.
- Improve tool selection for complex questions.
- Provide clearer explanations and visualizations of results.
- Expand support for larger datasets and additional file formats.
- Add automated tests for tool selection and numerical correctness.

---

**Live application:** https://byte-agent-ebon.vercel.app/

*Byte Agent — turning questions about data into actionable analysis.*

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
