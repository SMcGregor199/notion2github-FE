import { Alert, Button, Card, Spin, Tag, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { StyledTag } from "../components/styledTag";
import { filterResourcesByCategory, getResourceCategories, loadResourceGuide } from "../utils/resourceGuide";

function ResourceGuide() {
  const [resources, setResources] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    loadResourceGuide()
      .then((result) => {
        if (!cancelled) {
          setResources(result.data.resources);
          setStatus(result.source === "cache" ? "cached" : "ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => { cancelled = true; };
  }, [attempt]);

  const categories = useMemo(() => getResourceCategories(resources), [resources]);
  const visibleResources = useMemo(
    () => filterResourcesByCategory(resources, selectedCategory),
    [resources, selectedCategory],
  );

  return (
    <section className="resource-guide" aria-labelledby="resource-guide-title">
      <header className="resource-guide__header">
        <Typography.Text className="resource-guide__eyebrow">Living guide</Typography.Text>
        <Typography.Title id="resource-guide-title" level={1}>AI Research Resource Guide</Typography.Title>
        <Typography.Paragraph className="resource-guide__intro">
          A growing collection tracking where artificial intelligence enters academic research, what it changes, and how researcher judgment remains in the work.
        </Typography.Paragraph>
      </header>

      {status === "loading" ? <LoadingState /> : null}
      {status === "error" ? <UnavailableState onRetry={() => setAttempt((value) => value + 1)} /> : null}
      {status === "cached" ? <Typography.Text className="resource-guide__cache-note" type="secondary" role="status">Showing a saved copy while the guide refreshes.</Typography.Text> : null}
      {status === "ready" || status === "cached" ? (
        resources.length === 0 ? <EmptyGuide /> : (
          <>
            <div className="resource-guide__filters" role="radiogroup" aria-label="Filter resources by category">
              <CategoryFilter category="All" selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
              {categories.map((category) => (
                <CategoryFilter key={category} category={category} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
              ))}
            </div>
            <Typography.Text className="resource-guide__count" role="status" aria-live="polite">
              {visibleResources.length} {visibleResources.length === 1 ? "resource" : "resources"}
              {selectedCategory === "All" ? "" : ` in ${selectedCategory}`}
            </Typography.Text>
            {visibleResources.length ? (
              <div className="resource-guide__list">
                {visibleResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)}
              </div>
            ) : <FilterEmpty onReset={() => setSelectedCategory("All")} />}
          </>
        )
      ) : null}
    </section>
  );
}

function CategoryFilter({ category, selectedCategory, onSelect }) {
  const selected = selectedCategory === category;
  function activateFromKeyboard(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(category);
    }
  }
  return (
    <StyledTag
      checked={selected}
      onChange={() => onSelect(category)}
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={activateFromKeyboard}
    >
      {category}
    </StyledTag>
  );
}

function ResourceCard({ resource }) {
  const metadata = [resource.resourceType, resource.source, resource.creator, formatDate(resource.publishedDate)].filter(Boolean);
  return (
    <article>
      <Card className="resource-guide__card">
        <div className="resource-guide__card-heading">
          <Tag color="geekblue">{resource.category}</Tag>
          <Typography.Title level={2} className="resource-guide__title">
            <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}</a>
          </Typography.Title>
        </div>
        {metadata.length ? <Typography.Text className="resource-guide__metadata" type="secondary">{metadata.join(" · ")}</Typography.Text> : null}
        {resource.description ? <Typography.Paragraph className="resource-guide__description">{resource.description}</Typography.Paragraph> : null}
        {resource.publicAnnotation ? (
          <aside className="resource-guide__annotation" aria-label="Shayne's note">
            <Typography.Text strong>Shayne’s note</Typography.Text>
            <Typography.Paragraph>{resource.publicAnnotation}</Typography.Paragraph>
          </aside>
        ) : null}
        {resource.tags.length ? <div className="resource-guide__tags" aria-label="Resource tags">{resource.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div> : null}
      </Card>
    </article>
  );
}

function LoadingState() {
  return <div className="resource-guide__loading" role="status" aria-live="polite"><Spin size="small" /><Typography.Text type="secondary">Loading resources…</Typography.Text></div>;
}

function UnavailableState({ onRetry }) {
  return <Alert type="warning" showIcon message="The Resource Guide could not load." description={<><span>Please try again in a moment. </span><Button type="link" onClick={onRetry}>Retry</Button></>} />;
}

function EmptyGuide() {
  return <Typography.Paragraph type="secondary">Published resources will appear here soon.</Typography.Paragraph>;
}

function FilterEmpty({ onReset }) {
  return <div className="resource-guide__empty"><Typography.Paragraph type="secondary">No resources match this category yet.</Typography.Paragraph><Button onClick={onReset}>Show all resources</Button></div>;
}

function formatDate(value) {
  if (!value || Number.isNaN(Date.parse(value))) return "";
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default ResourceGuide;
