import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import React, { VFC, useCallback } from 'react';

import { SEARCH_PAGE_URL } from 'constants/routing';

import { useSearchResults } from 'features/search/search-results';
import { NoSearchResultsView } from 'features/search/search-results/components/no-search-results-view';

import {
  ResultSection,
  SearchResultDaoCard,
  SearchResultPeopleCard,
  SearchResultProposalLine,
} from './components/ResultSection';

import styles from './DropdownResults.module.scss';

interface DropdownResultsProps {
  width: number;
  closeSearch: () => void;
}

export const DropdownResults: VFC<DropdownResultsProps> = ({
  width,
  closeSearch,
}) => {
  const DAOS_TAB_IDNEX = 0;
  const PROPOSAL_TAB_INDEX = 1;
  const PEOPLE_TAB_INDEX = 2;

  const router = useRouter();
  const { searchResults } = useSearchResults();

  const { daos, proposals, members } = searchResults || {};

  const goToSearchPage = useCallback(
    (tabIndex: number) => {
      router.push({
        pathname: SEARCH_PAGE_URL,
        query: {
          tab: tabIndex,
        },
      });
    },
    [router]
  );

  const goToDaosTabOnSearchPage = useCallback(() => {
    goToSearchPage(DAOS_TAB_IDNEX);
  }, [goToSearchPage]);

  const goToProposalsTabOnSearchPage = useCallback(() => {
    goToSearchPage(PROPOSAL_TAB_INDEX);
  }, [goToSearchPage]);

  const goToPeopleTabOnSearchPage = useCallback(() => {
    goToSearchPage(PEOPLE_TAB_INDEX);
  }, [goToSearchPage]);

  function renderNoResults() {
    if (isEmpty(daos) && isEmpty(proposals) && isEmpty(members)) {
      return <NoSearchResultsView />;
    }

    return null;
  }

  function getThreeFirstResults<T>(data?: T[]): T[] {
    return data?.slice(0, 3) || [];
  }

  function renderDaos() {
    const dataToRender = getThreeFirstResults(daos);

    return (
      <ResultSection
        data={daos}
        title="DAOS"
        onSeeAll={goToDaosTabOnSearchPage}
      >
        {dataToRender.map(dao => (
          <SearchResultDaoCard data={dao} key={dao.id} onClick={closeSearch} />
        ))}
      </ResultSection>
    );
  }

  function renderProposals() {
    const proposalsToRender = getThreeFirstResults(proposals);

    return (
      <ResultSection
        title="Proposals"
        data={proposals}
        onSeeAll={goToProposalsTabOnSearchPage}
        contentClassName={styles.proposalsContent}
      >
        {proposalsToRender.map(proposal => (
          <SearchResultProposalLine
            data={proposal}
            key={proposal.id}
            onClick={goToProposalsTabOnSearchPage}
          />
        ))}
      </ResultSection>
    );
  }

  function renderPeople() {
    const peopleToRender = getThreeFirstResults(members);

    return (
      <ResultSection
        title="People"
        data={members}
        onSeeAll={goToPeopleTabOnSearchPage}
      >
        {peopleToRender.map(person => (
          <SearchResultPeopleCard
            data={person}
            key={person.id}
            onClick={goToPeopleTabOnSearchPage}
          />
        ))}
      </ResultSection>
    );
  }

  return (
    <div className={styles.root} style={{ width }}>
      {renderDaos()}
      {renderProposals()}
      {renderPeople()}

      {renderNoResults()}
    </div>
  );
};
